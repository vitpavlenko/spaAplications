'use strict';
const Joi = require('joi');

const { AsyncAdapter: SpaController }  = require('../controllers/spa_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [
    {
        path: '/api/spas',
        method: 'GET',
        handler: SpaController.list,
        config: {
            auth: 'token',
            description: 'List spa',
            notes: 'Returns a list of spas',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                query: {
                    page: Joi.number().integer().min(1).default(1),
                    page_size: Joi.number().integer().min(1).max(1000).default(50),
                    name: Joi.string()
                }
            }
        }
    }, {
        path: '/api/spas',
        method: 'POST',
        handler: SpaController.create,
        config: {
            auth: 'token',
            description: 'Create spa',
            notes: 'Creates an spa with the attributes provided in the request body',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    name: Joi.string().required().description('the name for the spa'),
                    code: Joi.string().required().description('the code for the spa'),
                    author_id: Joi.number().required().description('the id for the author')
                }
            }
        }
    }, {
        path: '/api/spas/{spa_id}',
        method: 'GET',
        handler: SpaController.show,
        config: {
            auth: 'token',
            description: 'Get spa',
            notes: 'Returns an spa by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    spa_id: Joi.number().integer().required().min(0).description('the id for the spa')
                }
            }
        }
    }, {
        path: '/api/spas/{spa_id}',
        method: 'PUT',
        handler: SpaController.update,
        config: {
            auth: 'token',
            description: 'Updates spa',
            notes: 'Updates an spa by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    spa_id: Joi.number().integer().required().min(0).description('the id for the spa')
                },
                payload: {
                    name: Joi.string().required().description('the name for the spa'),
                    code: Joi.string().required().description('the code for the spa')
                }
            }
        }
    }, {
        path: '/api/spas/{spa_id}',
        method: 'DELETE',
        handler: SpaController.destroy,
        config: {
            auth: 'token',
            description: 'Delete spa',
            notes: 'Deletes an spa by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    spa_id: Joi.number().integer().required().min(0).description('the id for the spa')
                }
            }
        }
    }
];
