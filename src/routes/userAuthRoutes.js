'use strict';
const Joi = require('joi');

const { AsyncAdapter: UserAuthController } = require('../controllers/user_auth_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [
    {
        path: '/api/auth/sign_in',
        method: 'POST',
        handler: UserAuthController.signIn,
        config: {
            tags: ['api'],
            description: 'Sig in a Account',
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            }
        }
    }, {
        path: '/api/auth/sign_up',
        method: 'POST',
        handler: UserAuthController.signUp,
        config: {
            tags: ['api'],
            description: 'Register new Account',
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    email: Joi.string().email().required().description('the unique email for the account'),
                    password: Joi.string().required().description('the password for the account'),
                    username: Joi.string().min(1).required()
                }
            }
        }
    }, {
        path: '/api/auth/update_password',
        method: 'POST',
        handler: UserAuthController.updatePassword,
        config: {
            auth: 'token',
            tags: ['api'],
            description: 'Update user password',
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            }
        }
    }
];