const BaseController = require('./base_controller');
const { RolePermission } = require('../models');

const sequelize = require('../db');

class RolePermissionController extends BaseController {}

RolePermissionController.model = RolePermission;
RolePermissionController.controllerName = 'role_permissions';

RolePermissionController.sequelize = sequelize;

RolePermissionController.options = {
  id: 'role_permission_id',
  searchBy: ['role_id', 'permission_id']
};

module.exports = RolePermissionController;
