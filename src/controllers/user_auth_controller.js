'use strict';

const Boom = require('boom');

const { ValidationError } = require('sequelize');

const { pick, map, partialRight } = require('lodash');

const { User } = require('../models');

const AsyncAdapter = require('../utils/AsyncAdapter');

const JWTsign = require('../utils/JWTsign');

const asyncInterface = [
    'signIn',
    'signUp',
    'updatePassword'
];

class UserAuthController {

    static get AsyncAdapter() {

        return AsyncAdapter.call(this, asyncInterface);
    }

    static async signIn(request, h) {

        const { email, password } = request.payload;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return h.notFound('User not found');
        }

        user.permissions = await user.getFrontendPermissions();

        try {
            await user.authenticate(password);
        } catch (err) {
            return h.forbidden('Incorrect password');
        }

        const token = JWTsign(email);

        return { token, user };
    }

    static async afterSignUp(request, response) {

        return response;
    }

    static async signUp(request, h) {

        try {

            const { createWith } = this.options;
            const { payload } = request;

            const data = (createWith) ? (pick(payload, createWith)) : (payload);

            const record = await User.create(data);
            record.permissions = await record.getFrontendPermissions();
                
            const token = JWTsign(record.email);

            const response = h.response({
                user: record,
                token
            });

            return await this.afterSignUp(request, response)
                .catch((err) => this.onHookError(err));

        } catch (err) {
            this.onError(err, request, h);
        }
    }

    static async current(request, h) {

        const { credentials: { user: signedUser, resign_User: resignedUser } } = request.auth;

        const user = await User.findById(signedUser.id);
        let resignUser;
        let resignPermissions;

        if (!user) {
            return Boom.notFound('User not found');
        }

        const permissions = map(
            await user.getPermissions(),
            partialRight(pick, ['id', 'action'])
        );

        if (resignedUser) {
            resignUser = await User.findById(resignedUser.id);

            if (!resignUser) {
                return Boom.notFound('Resigned User not found');
            }

            resignPermissions = map(
                await resignUser.getPermissions(),
                partialRight(pick, ['id', 'action'])
            );
        }

        return h.response({ user, permissions, resign_User: resignUser, resign_permissions: resignPermissions });
    }

    static async updateCurrent(request, h) {

        const { updateWith } = this.options;
        const { payload } = request;
        const { credentials: { User: signedUser } } = request.auth;

        const data = (updateWith) ? (pick(payload, updateWith)) : (payload);

        await signedUser.update(data);

        return h.response({ user: signedUser });
    }

    static async resignIn(request, h) {

        const {
            auth: { credentials: { user: signedUser } },
            payload: { resign_User_id: resignUserId }
        } = request;

        const permissionName = 'User_auth_resign_in';
        const hasPermission = await signedUser.hasPermission(permissionName);

        if (!hasPermission) {
            return Boom.forbidden(`You do not have ${permissionName} permission`);
        }

        const user = await User.findById(signedUser.id);
        const resign_User = await User.findById(resignUserId);

        const token = JWTsign(user.email, resignUserId); 

        return h.response({ user, resign_User, token });
    }

    static async relogout(request, h) {

        const { auth: { credentials: { user: signedUser } } } = request;

        const permissionName = 'User_auth_resign_in';
        const hasPermission = await signedUser.hasPermission(permissionName);

        if (!hasPermission) {
            return Boom.forbidden(`You do not have ${permissionName} permission`);
        }

        const user = await User.findById(signedUser.id);

        const token = JWTsign(user.email);

        return h.response({ user, token });
    }

    static async updatePassword(request, h) {

        const { email, password } = request.payload;
    
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
          return h.notFound('User not found');
        }
    
        await user.updatePassword(password);
    
        return h.response({ success: true });
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
     */
    static async onError(err) {

        if (err instanceof ValidationError) {

            const boomErr = Boom.badRequest(err.message);

            boomErr.output.payload.errors = this.formatValidationErrors(err.errors);

            return boomErr;
        }

        return err;
    }
}

UserAuthController.options = {
    createWith: [
        'email',
        'password',
        'username'
    ],
    updateWith: [
        'password',
        'username'
    ]
};

module.exports = UserAuthController;
