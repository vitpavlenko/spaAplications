'use strict';
const Joi = require('joi');

const { AsyncAdapter: CommentLikeController }  = require('../controllers/comment_like_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [
    {
        path: '/api/comment_likes',
        method: 'GET',
        handler: CommentLikeController.list,
        config: {
            auth: 'token',
            description: 'List comment like',
            notes: 'Returns a list of comment likes',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                query: {
                    page: Joi.number().integer().min(1).default(1),
                    page_size: Joi.number().integer().min(1).max(1000).default(50)
                }
            }
        }
    }, {
        path: '/api/comment_likes',
        method: 'POST',
        handler: CommentLikeController.create,
        config: {
            auth: 'token',
            description: 'Create comment like',
            notes: 'Creates an comment like with the attributes provided in the request body',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    author_id: Joi.number().min(1).required().description('the author id for the comment like'),
                    comment_id: Joi.number().min(1).required().description(' ')
                }
            }
        }
    }, {
        path: '/api/comment_likes/{comment_like_id}',
        method: 'GET',
        handler: CommentLikeController.show,
        config: {
            auth: 'token',
            description: 'Get comment like',
            notes: 'Returns an comment like by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    comment_like_id: Joi.number().integer().required().min(0).description('the id for the comment like')
                }
            }
        }
    // }, {
    //     path: '/api/comment_likes/{comment_like_id}',
    //     method: 'PUT',
    //     handler: CommentLikeController.update,
    //     config: {
    //         auth: 'token',
    //         description: 'Updates comment like',
    //         notes: 'Updates an comment like by the id passed in the path',
    //         tags: ['api'],
    //         validate: {
    //             options: { abortEarly: false },
    //             failAction: reformatValidationOutput,
    //             params: {
    //                 comment_like_id: Joi.number().integer().required().min(0).description('the id for the comment like')
    //             },
    //             payload: {
    //                 message: Joi.string().required().description('the message for the comment')
    //             }
    //         }
    //     }
    }, {
        path: '/api/comment_likes/{comment_like_id}',
        method: 'DELETE',
        handler: CommentLikeController.destroy,
        config: {
            auth: 'token',
            description: 'Delete comment like',
            notes: 'Deletes an comment like by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    comment_like_id: Joi.number().integer().required().min(0).description('the id for the comment like')
                }
            }
        }
    }
];
