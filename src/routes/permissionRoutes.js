const Joi = require('joi');
const { AsyncAdapter: PermissionController } = require('../controllers/permission_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [{
  path: '/api/permissions',
  method: 'GET',
  handler: PermissionController.list,
  config: {
    auth: 'token',
    description: 'List permissions',
    notes: 'Returns a list of permissions',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      query: {
        page: Joi.number().integer().min(1).default(1),
        page_size: Joi.number().integer().min(1).max(1000).default(50),
        action: [Joi.string(), Joi.object().pattern(/^/, Joi.string())]
      }
    }
  }
}, {
  path: '/api/permissions',
  method: 'POST',
  handler: PermissionController.create,
  config: {
    auth: 'token',
    description: 'Create permission',
    notes: 'Creates a permission with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        action: Joi.string().required().description('the unique action for the permission'),
        frontend: Joi.boolean().optional(),
        role_ids: Joi.array().optional()
      }
    }
  }
}, {
  path: '/api/permissions/{permission_id}',
  method: 'GET',
  handler: PermissionController.show,
  config: {
    auth: 'token',
    description: 'Get permission',
    notes: 'Returns a permission by the id passed in the path',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        permission_id: Joi.number().integer().required().min(0).description('the id for the permission')
      }
    }
  }
}, {
  path: '/api/permissions/{permission_id}',
  method: 'PUT',
  handler: PermissionController.update,
  config: {
    auth: 'token',
    description: 'Update permission',
    notes: 'Updates a permission by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        permission_id: Joi.number().integer().required().min(0).description('the id for the permission')
      },
      payload: {
        action: Joi.string()
      }
    }
  }
}, {
  path: '/api/permissions/{permission_id}',
  method: 'DELETE',
  handler: PermissionController.destroy,
  config: {
    auth: 'token',
    description: 'Delete permission',
    notes: 'Deletes a permission by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        permission_id: Joi.number().integer().required().min(0).description('the id for the permission')
      }
    }
  }
}];
