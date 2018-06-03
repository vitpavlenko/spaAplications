'use strict';

const BaseController = require('./base_controller');
const { PostLike } = require('../models');

class PostLikeController extends BaseController {}

PostLikeController.model = PostLike;
PostLikeController.controllerName = 'post_likes';

PostLikeController.options = {
    id: 'post_like_id',
    createWith: ['author_id', 'post_id']//, 'comment']
};

module.exports = PostLikeController;