'use strict';
const BaseController = require('./base_controller');
const { Comment } = require('../models');

class CommentController extends BaseController {}

CommentController.model = Comment;
CommentController.controllerName = 'comments';

CommentController.options = {
    id: 'comment_id',
    searchBy: ['comment']  
};

module.exports = CommentController;