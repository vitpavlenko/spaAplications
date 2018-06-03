'use strict';
const Joi = require('joi');

const { AsyncAdapter: PostLikeController }  = require('../controllers/post_like_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [
    {
        path: '/api/post_likes',
        method: 'GET',
        handler: PostLikeController.list,
        config: {
            auth: 'token',
            description: 'List post like',
            notes: 'Returns a list of post likes',
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
        path: '/api/post_likes',
        method: 'POST',
        handler: PostLikeController.create,
        config: {
            auth: 'token',
            description: 'Create post like',
            notes: 'Creates an post like with the attributes provided in the request body',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                payload: {
                    author_id: Joi.number().required().description('the author id for the post like'),
                    post_id: Joi.number().min(1).required().description('the id for the post')
                }
            }
        }
    }, {
        path: '/api/post_likes/{post_like_id}',
        method: 'GET',
        handler: PostLikeController.show,
        config: {
            auth: 'token',
            description: 'Get post like',
            notes: 'Returns an post like by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    post_like_id: Joi.number().integer().required().min(0).description('the id for the post like')
                }
            }
        }
    // }, {
    //     path: '/api/post_likes/{post_like_id}',
    //     method: 'PUT',
    //     handler: CommentController.update,
    //     config: {
    //         auth: 'token',
    //         description: 'Updates post like',
    //         notes: 'Updates an post like by the id passed in the path',
    //         tags: ['api'],
    //         validate: {
    //             options: { abortEarly: false },
    //             failAction: reformatValidationOutput,
    //             params: {
    //                 post_like_id: Joi.number().integer().required().min(0).description('the id for the post like')
    //             },
    //             payload: {
    //                 message: Joi.string().required().description('the message for the post')
    //             }
    //         }
    //     }
    }, {
        path: '/api/post_likes/{post_like_id}',
        method: 'DELETE',
        handler: PostLikeController.destroy,
        config: {
            auth: 'token',
            description: 'Delete post like',
            notes: 'Deletes an post like by the id passed in the path',
            tags: ['api'],
            validate: {
                options: { abortEarly: false },
                failAction: reformatValidationOutput,
                params: {
                    post_like_id: Joi.number().integer().required().min(0).description('the id for the post like')
                }
            }
        }
    }
];
