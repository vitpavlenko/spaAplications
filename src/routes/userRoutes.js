'use strict';
const Joi = require('joi');

const { AsyncAdapter: UserController }  = require('../controllers/user_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [
    {
        path: '/api/users',
        method: 'GET',
        handler: UserController.list,
        config: {
            auth: 'token',
            description: 'List user',
            notes: 'Returns a list of users',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                query: {
                    page: Joi.number().integer().min(1).default(1),
                    page_size: Joi.number().integer().min(1).max(1000).default(50),
                    email: Joi.string().email(),
                    username: Joi.string()
                }
            }
        }
    }, {
        path: '/api/users',
        method: 'POST',
        handler: UserController.create,
        config: {
            auth: 'token',
            description: 'Create user',
            notes: 'Creates an user with the attributes provided in the request body',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    email: Joi.string().email().required().description('the email for the user'),
                    username: Joi.string().required().description('the username for the user'),
                    password: Joi.string().required().description('the password for the user')
                }
            }
        }
    }, {
        path: '/api/users/{user_id}',
        method: 'GET',
        handler: UserController.show,
        config: {
            auth: 'token',
            description: 'Get user',
            notes: 'Returns an user by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    user_id: Joi.number().integer().required().min(0).description('the id for the user')
                }
            }
        }
    }, {
        path: '/api/users/{user_id}',
        method: 'PUT',
        handler: UserController.update,
        config: {
            auth: 'token',
            description: 'Updates user',
            notes: 'Updates an user by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    user_id: Joi.number().integer().required().min(0).description('the id for the user')
                },
                payload: {
                    email: Joi.string().email().description('the unique email for the user'),
                    username: Joi.string().description('the username for the user'),
                    role_ids: Joi.array().items(Joi.number().integer().min(0))
                }
            }
        }
    }, {
        path: '/api/users/{user_id}',
        method: 'DELETE',
        handler: UserController.destroy,
        config: {
            auth: 'token',
            description: 'Delete user',
            notes: 'Deletes an user by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    user_id: Joi.number().integer().required().min(0).description('the id for the user')
                }
            }
        }
    }
];
