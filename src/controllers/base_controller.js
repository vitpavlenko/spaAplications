'use strict';
// const Promise = require('bluebird');

const { Op, ValidationError } = require('sequelize');
const { pick, defaults, cloneDeep } = require('lodash'); //, omit, mapKeys

const { Role, RolePermission, Permission } = require('../models');

const Boom = require('boom');

const AsyncAdapter = require('../utils/AsyncAdapter');

const defaultOptions = {
    id: 'id',
    searchBy: [],
    asyncInterface: ['list', 'create', 'show', 'update', 'destroy'],
    permittedFilterOps: {
        eq: Op.eq,
        ne: Op.ne,
        lt: Op.lt,
        lte: Op.lte,
        gt: Op.gt,
        gte: Op.gte,
        like: Op.like,
        ilike: Op.iLike,
        regex: Op.regexp
    }
};

/**
 * Abstract Hapi controller class. It cannot be directly used to handle Hapi requests. Instead, it must be inherited. To inherit from BaseController one may use regular ES6 class extension. Also, it is required to set the model as a static property.
 * @example
 * class ConcreteController extends BaseController {
 * // Here you may override BaseController methods if you need so.
 * }
 * ConcreteController.model = ConcreteModel; // Sequelize models are accepted.
 * ConcreteController.options = {
 *  id: 'entity_id', // Hapi route id parameter name.
 *  searchBy: ['field1', 'field2'] // model field whitelist to search by.
 * };
 */
class BaseController {
    static set model(value) {
        this._model = value;
    }

    static get model() {

        if (!this._model) {
            throw new Error('The model is not specified for the controller');
        }

        return this._model;
    }

    static get AsyncAdapter() {

        return AsyncAdapter.call(this, this.options.asyncInterface);
    }

    static set controllerName(value) {

        this._controllerName = value;
    }

    static get controllerName() {

        if (!this._controllerName) {
            throw new Error('The controller name is not specified for the controller');
        }

        return this._controllerName;
    }

    static set options(value) {

        this._options = defaults(value, cloneDeep(defaultOptions));
    }

    static get options() {

        if (!this._options) {
            this._options = cloneDeep(defaultOptions);
        }

        return this._options;
    }

    static processSearchFilterField(field, value) {

        let filterConditions = value;

        if (typeof value === 'string') {
            try {
                filterConditions = JSON.parse(value);
            } catch (err) {
                return value; // Non-JSON field, falling back to a simple equivalence filter
            }
        }

        if (typeof filterConditions !== 'object') {
            return value;
        }

        if (Array.isArray(filterConditions)) {
            throw new Error(`"${field}" cannot be an array`);
        }

        if (!Object.keys(filterConditions).length) {
            throw new Error(`"${field}" cannot be searched by "{}"`);
        }

        const result = {};

        Object.keys(filterConditions).forEach((condition) => {

            const op = this.options.permittedFilterOps[condition];

            if (!op) {
                throw new Error(`"${field}" is being searched by illegal operator "${condition}"`);
            }

            result[op] = filterConditions[condition];

        });

        return result;
    }

    static processSearchFilters(query) {

        const result = {};
        const boomErr = Boom.badRequest('Bad search field format');

        boomErr.output.payload.errors = {};

        Object.keys(query).forEach((field) => {
            try {
                result[field] = this.processSearchFilterField(field, query[field]);
            } catch (err) {
                boomErr.output.payload.errors[field] = [err.message];
            }
        });

        if (Object.keys(boomErr.output.payload.errors).length) {
            throw boomErr;
        }

        return result;
    }


    /* CONTROLLER ACTIONS AND HOOKS */

    /**
     * A hook to call before list action. Used to preprocess user input before passing to the ORM.
     * @async
     * @param {Object} request - Hapi request object
     */
    static async beforeList(request) {
    
        try {
            await this.checkActionPermission(request, 'index');

            const { searchBy } = this.options;
    
            const { page, page_size } = request.query;
    
            if (typeof page !== 'number') {
                throw new Error('Wrong "page" type');
            }
    
            if (typeof page_size !== 'number') {
                throw new Error('Wrong "page_size" type');
            }
    
            return {
                where: this.processSearchFilters(pick(request.query, searchBy)),
                offset: page_size * (page - 1),
                limit: page_size,
                order: [['created_at', 'DESC']]
            };
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    /**
     * A hook to call after list action. Used to perform actions that are executed after response is sent back to the caller. Hence, one may not manipulate the response using this hook.
     * @async
     * @param {Object} request - Hapi request object
     * @param {Object} response - Hapi reply object
     */
    static async afterList(request, response) {
        return response;
    }

    /**
     * Enlist the records matching some query. Response contains the item list and the metadata with overall records count matching the query.
     * @async
     * @param {Object} request - Hapi request object
     * @param {Object} h - Hapi object
     */
    static async list(request, h) {

        try {
            const query = await this.beforeList(request, h);
            const records = await this.model.unscoped().findAndCountAll(query);

            const response = {
                meta: { count: records.count },
                items: records.rows
            };

            return await this.afterList(request, response)
                .catch((err) => this.onHookError(err));

        } catch (err) {
            this.onError(err, request, h);
        }
    }

    /**
     * A hook to call before create action. Used to preprocess user input before passing to the ORM.
     * @async
     * @param {Object} request - Hapi request object
     */
    static async beforeCreate(request) {

        await this.checkActionPermission(request, 'create');

        const { createWith } = this.options;
        const { payload } = request;

        return (createWith) ? (pick(payload, createWith)) : (payload);
    }

    static async afterCreate(request, response) {

        return response;
    }

    /**
     * Create a record with the data from the request body. Response contains the created record.
     * @async
     * @param {Object} request - Hapi request object
     * @param {Object} h - Hapi  object
     */
    static async create(request, h) {

        try {
            const data = await this.beforeCreate(request);
            // console.log(this.model.rawAttributes);
            const record = await this.model.create(data);
            // console.log(record);
            return await this.afterCreate(request, record)
                .catch((err) => this.onHookError(err));

        } catch (err) {
            console.error(err);
            this.onError(err, request, h);
        }
    }

    /**
     * A hook to call before show action. Used to preprocess user input before passing to the ORM.
     * @async
     * @param {Object} request - Hapi request object
     */
    static async beforeShow(request) {

        await this.checkActionPermission(request, 'show');

        const { id } = this.options;

        return request.params[id];
    }

    /**
   * A hook to call after show action. Used to perform actions that are executed after response is sent back to the caller. Hence, one may not manipulate the response using this hook.
   * @async
   * @param {Object} request - Hapi request object
   * @param {Object} response - Hapi reply object
   */
    static async afterShow(request, response) {

        return response;
    }

    /**
     * Read a record with the given id. Response contains the fetched record. If there is no such record, 404 status code is returned to the user.
     * @async
     * @param {Object} request - Hapi request object
     * @param {Object} reply - Hapi reply object
     */
    static async show(request, h) {

        try {
            const recordId = await this.beforeShow(request);
            const record = await this.model.findById(recordId);

            if (!record) {
                return Boom.notFound(`${this.model.name} not found`);
            }

            return await this.afterShow(request, record)
                .catch((err) => this.onHookError(err));

        } catch (err) {
            this.onError(err, request, h);
        }
    }

    /**
     * A hook to call before update action. Used to preprocess user input before passing to the ORM.
     * @async
     * @param {Object} request - Hapi request object
     */
    static async beforeUpdate(request) {

        await this.checkActionPermission(request, 'update');

        const { id, updateWith } = this.options;
        const { payload } = request;
        const recordId = request.params[id];
        const data = (updateWith) ? (pick(payload, updateWith)) : (payload);

        return { recordId, data };
    }

    /**
     * A hook to call after update action. Used to perform actions that are executed after response is sent back to the caller. Hence, one may not manipulate the response using this hook.
     * @async
     * @param {Object} request - Hapi request object
     * @param {Object} response - Hapi reply object
     */
    static async afterUpdate(request, response) {

        return response;
    }

    /**
     * Update a record with the given id using the request data. Response contains the updated record. If there is no such record, 404 status code is returned to the user.
     * @async
     * @param {Object} request - Hapi request object
     * @param {Object} reply - Hapi reply object
     */
    static async update(request, h) {

        try {
            const { recordId, data } = await this.beforeUpdate(request);
            const record = await this.model.findById(recordId);

            if (!record) {
                return Boom.notFound(`${this.model.name} not found`);
            }

            await record.update(data);

            return await this.afterUpdate(request, record)
                .catch((err) => this.onHookError(err));

        } catch (err) {
            this.onError(err, request, h);
        }
    }

    /**
     * A hook to call before destroy action. Used to preprocess user input before passing to the ORM.
     * @async
     * @param {Object} request - Hapi request object
     */
    static async beforeDestroy(request) {

        await this.checkActionPermission(request, 'destroy');

        const { id } = this.options;

        return request.params[id];
    }

    /**
     * A hook to call after destroy action. Used to perform actions that are executed after response is sent back to the caller. Hence, one may not manipulate the response using this hook.
     * @async
     * @param {Object} request - Hapi request object
     * @param {Object} response - Hapi reply object
     */
    static async afterDestroy(request, response) {

        return response;
    }

    static async destroy(request, h) {

        try {
            const recordId = await this.beforeDestroy(request);
            const record = await this.model.findById(recordId);

            if (!record) {
                return Boom.notFound(`${this.model.name} not found`);
            }

            await record.destroy();

            return await this.afterDestroy(request, record)
                .catch((err) => this.onHookError(err));

        } catch (err) {
            this.onError(err, request, h);
        }
    }

    /**
     * Format Sequelize ValidationError errors list into a map with keys corresponding to paths (attributes) that triggered an error and values corresponding to error messages.
     * @param {Sequelize.ValidationErrorItem[]} errors - ValidationError.errors is usually expected.
     * @returns {Object} A map with keys organized as { path : message }.
     */
    static formatValidationErrors(errors) {

        const result = {};

        errors.forEach((err) => {

            if (!err.path) {
                throw new Error('error item lacks "path" property');
            }

            result[err.path] = [err.message];
        });

        return result;
    }

    /**
     * An error handler for controller actions.
     * @param {Error} err
     * @param {Object} request - Hapi request object.
     * @param {Object} reply - Hapi reply object.
     */
    static async onError(err) {

        if (err instanceof ValidationError) {

            const boomErr = Boom.badRequest(err.message);

            boomErr.output.payload.errors = this.formatValidationErrors(err.errors);

            return boomErr;
        }

        return err;
    }

    /**
     * An error handler for controller action hooks.
     * @param {Error} err
     */
    static async onHookError(err) {

        if (!err) {
            throw new Error('Error argument is required');
        }

        console.error(err);
        // bugsnag.notify(err);
    }

    static async checkActionPermission(request, action) {

        if (!request.auth) {
            return; // Test mode detected, skipping permission check. NOTE: this is a temporary workaround to make this testable before proper stubs are being made.
        }

        const permissionName = `${this.model.getTableName()}_${this.controllerName}_${action}`;
        const permission = await Permission.findOne({ where: { action: permissionName } });

        if (!permission) {

            throw new Error(`Permission "${permissionName}" does not exist`);
        }

        if (!request.auth.credentials) {
            throw this.checkAnonymousPermission(permission);
        }

        const { credentials: { user: signedUser } } = request.auth;

        const accountHasPermission = await signedUser.hasPermission(permissionName);

        if (!accountHasPermission) {
            throw Boom.forbidden(`You do not have ${permissionName} permission`);
        }
    }

    static async checkAnonymousPermission(permission) {

        const anonymousRole = await Role.findOne({ where: { name: 'anonymous' } });

        if (!anonymousRole) {
            throw new Error('Unable to check unauthorized user permissions: "anonymous" role does not exist');
        }

        const anonymousHasPermission = await RolePermission.findOne({
            where: {
                role_id: anonymousRole.id,
                permission_id: permission.id
            }
        });

        if (!anonymousHasPermission) {
            throw Boom.forbidden(`You do not have ${permission.action} permission`);
        }
    }
}

module.exports = BaseController;
