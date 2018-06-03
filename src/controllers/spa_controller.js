'use strict';
const BaseController = require('./base_controller');
const { Spa } = require('../models');

class SpaController extends BaseController {}

SpaController.model = Spa;
SpaController.controllerName = 'spas';

SpaController.options = {
    id: 'spa_id',
    searchBy: ['action', 'name'],
    createWith: ['name', 'code', 'author_id'] 
};

module.exports = SpaController;