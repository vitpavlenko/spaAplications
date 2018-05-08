'use strict';
const BaseController = require('./base_controller');
const { Permission } = require('../models');

class PermissionController extends BaseController {}

PermissionController.model = Permission;
PermissionController.controllerName = 'permissions';

PermissionController.options = {
    id: 'permission_id',
    searchBy: ['action']  
};

module.exports = PermissionController;