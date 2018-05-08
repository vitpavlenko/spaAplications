'use strict';
const BaseController = require('./base_controller');
const { Post } = require('../models');

class PostController extends BaseController {}

PostController.model = Post;
PostController.controllerName = 'posts';

PostController.options = {
    id: 'post_id',
    searchBy: ['message']  
};

module.exports = PostController;