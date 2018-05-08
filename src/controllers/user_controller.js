'use strict';

const Boom = require('boom');
const BaseController = require('./base_controller');
const sequelize = require('../db');
const { User } = require('../models');

class UserController extends BaseController {
    
    static async update(request, h) {

        const { role_ids } = request.payload;

        if (!role_ids) {
            return super.update(request, h);
        }

        try {
            const { recordId, data } = await this.beforeUpdate(request);
            const record = await this.model.findById(recordId);

            if (!record) {
                return Boom.notFound(`${this.model.name} not found`);
            }

            await this.sequelize.transaction(async (t) => {

                await record.update(data, { transaction: t });
                await record.setRoles(role_ids, { transaction: t });
            });

            await record.reload();

            const response = h.response(record);

            return await this.afterUpdate(request, response)
                .catch((err) => this.onHookError(err));

        } catch (err) {
            this.onError(err, request, h);
        }
    }
}

UserController.model = User;
UserController.controllerName = 'users';

UserController.sequelize = sequelize;

UserController.options = {
    id: 'user_id',
    searchBy: ['email', 'username'],
    createWith: [
        'email',
        'username',
        'password'
    ],
    updateWith: [
        'username',
        'email'
    ],
    asyncInterface: ['list', 'create', 'show', 'update', 'destroy']
};

module.exports = UserController;