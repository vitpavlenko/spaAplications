'use strict';
const Joi = require('joi');

const { AsyncAdapter: PostController }  = require('../controllers/post_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [
    {
        path: '/api/posts',
        method: 'GET',
        handler: PostController.list,
        config: {
            auth: 'token',
            description: 'List post',
            notes: 'Returns a list of posts',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                query: {
                    page: Joi.number().integer().min(1).default(1),
                    page_size: Joi.number().integer().min(1).max(1000).default(50),
                    message: Joi.string()
                }
            }
        }
    }, {
        path: '/api/posts',
        method: 'POST',
        handler: PostController.create,
        config: {
            auth: 'token',
            description: 'Create post',
            notes: 'Creates an post with the attributes provided in the request body',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    message: Joi.string().required().description('the message for the post'),
                    author_id: Joi.number().min(1).required().description('the id for the user'),
                    spa_id: Joi.number().min(1).required().description('the id for the spa')
                }
            }
        }
    }, {
        path: '/api/posts/{post_id}',
        method: 'GET',
        handler: PostController.show,
        config: {
            auth: 'token',
            description: 'Get post',
            notes: 'Returns an post by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    post_id: Joi.number().integer().required().min(0).description('the id for the post')
                }
            }
        }
    }, {
        path: '/api/posts/{post_id}',
        method: 'PUT',
        handler: PostController.update,
        config: {
            auth: 'token',
            description: 'Updates post',
            notes: 'Updates an post by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    post_id: Joi.number().integer().required().min(0).description('the id for the post')
                },
                payload: {
                    message: Joi.string().required().description('the message for the post')
                }
            }
        }
    }, {
        path: '/api/posts/{post_id}',
        method: 'DELETE',
        handler: PostController.destroy,
        config: {
            auth: 'token',
            description: 'Delete post',
            notes: 'Deletes an post by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    post_id: Joi.number().integer().required().min(0).description('the id for the post')
                }
            }
        }
    }
];
