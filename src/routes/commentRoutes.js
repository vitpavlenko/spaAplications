'use strict';
const Joi = require('joi');

const { AsyncAdapter: CommentController }  = require('../controllers/comment_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [
    {
        path: '/api/comments',
        method: 'GET',
        handler: CommentController.list,
        config: {
            auth: 'token',
            description: 'List comment',
            notes: 'Returns a list of comments',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                query: {
                    page: Joi.number().integer().min(1).default(1),
                    page_size: Joi.number().integer().min(1).max(1000).default(50),
                    comment: Joi.string()
                }
            }
        }
    }, {
        path: '/api/comments',
        method: 'POST',
        handler: CommentController.create,
        config: {
            auth: 'token',
            description: 'Create comment',
            notes: 'Creates an comment with the attributes provided in the request body',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    comment: Joi.string().required().description('the comment for the comment'),
                    author_id: Joi.number().min(1).required(),
                    post_id: Joi.number().min(1).required()
                }
            }
        }
    }, {
        path: '/api/comments/{comment_id}',
        method: 'GET',
        handler: CommentController.show,
        config: {
            auth: 'token',
            description: 'Get comment',
            notes: 'Returns an comment by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    comment_id: Joi.number().integer().required().min(0).description('the id for the comment')
                }
            }
        }
    }, {
        path: '/api/comments/{comment_id}',
        method: 'PUT',
        handler: CommentController.update,
        config: {
            auth: 'token',
            description: 'Updates comment',
            notes: 'Updates an comment by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    comment_id: Joi.number().integer().required().min(0).description('the id for the comment')
                },
                payload: {
                    comment: Joi.string().required().description('the comment for the comment')
                }
            }
        }
    }, {
        path: '/api/comments/{comment_id}',
        method: 'DELETE',
        handler: CommentController.destroy,
        config: {
            auth: 'token',
            description: 'Delete comment',
            notes: 'Deletes an comment by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    comment_id: Joi.number().integer().required().min(0).description('the id for the comment')
                }
            }
        }
    }
];
