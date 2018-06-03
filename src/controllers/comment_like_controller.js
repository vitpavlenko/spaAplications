'use strict';
const BaseController = require('./base_controller');
const { CommentLike } = require('../models');

class CommentLikeController extends BaseController {}

CommentLikeController.model = CommentLike;
CommentLikeController.controllerName = 'comment_likes';

CommentLikeController.options = {
    id: 'comment_like_id',
    createWith: ['author_id', 'comment_id']
};

module.exports = CommentLikeController;