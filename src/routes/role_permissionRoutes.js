const Joi = require('joi');
const { AsyncAdapter: RolePermissionController } = require('../controllers/role_permission_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [{
  path: '/api/role_permissions',
  method: 'GET',
  handler: RolePermissionController.list,
  config: {
    auth: 'token',
    description: 'List roles',
    notes: 'Returns a list of roles',
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
  path: '/api/role_permissions',
  method: 'POST',
  handler: RolePermissionController.create,
  config: {
    auth: 'token',
    description: 'Create role',
    notes: 'Creates a role with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        role_id: Joi.number().required(),
        permission_id: Joi.number().required()
      }
    }
  }
}, {
  path: '/api/role_permissions/{role_permission_id}',
  method: 'GET',
  handler: RolePermissionController.show,
  config: {
    auth: 'token',
    description: 'Get role',
    notes: 'Returns a role by the id passed in the path',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        role_permission_id: Joi.number().integer().required().min(0).description('the id for the role')
      }
    }
  }
}, {
  path: '/api/role_permissions/{role_permission_id}',
  method: 'DELETE',
  handler: RolePermissionController.destroy,
  config: {
    auth: 'token',
    description: 'Delete role',
    notes: 'Deletes a role by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        role_permission_id: Joi.number().integer().required().min(0).description('the id for the role')
      }
    }
  }
}];
