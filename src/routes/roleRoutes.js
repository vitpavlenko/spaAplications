const Joi = require('joi');
const { AsyncAdapter: RoleController } = require('../controllers/role_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [{
  path: '/api/roles',
  method: 'GET',
  handler: RoleController.list,
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
        page_size: Joi.number().integer().min(1).max(1000).default(50),
        name: Joi.string()
      }
    }
  }
}, {
  path: '/api/roles',
  method: 'POST',
  handler: RoleController.create,
  config: {
    auth: 'token',
    description: 'Create role',
    notes: 'Creates a role with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        name: Joi.string().required().description('the unique name for the role')
      }
    }
  }
}, {
  path: '/api/roles/{role_id}',
  method: 'GET',
  handler: RoleController.show,
  config: {
    auth: 'token',
    description: 'Get role',
    notes: 'Returns a role by the id passed in the path',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        role_id: Joi.number().integer().required().min(0).description('the id for the role')
      }
    }
  }
}, {
  path: '/api/roles/{role_id}',
  method: 'PUT',
  handler: RoleController.update,
  config: {
    auth: 'token',
    description: 'Update role',
    notes: 'Updates a role by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        role_id: Joi.number().integer().required().min(0).description('the id for the role')
      },
      payload: {
        name: Joi.string(),
        permission_ids: Joi.array().items(Joi.number().integer().min(0))
      }
    }
  }
}, {
  path: '/api/roles/{role_id}',
  method: 'DELETE',
  handler: RoleController.destroy,
  config: {
    auth: 'token',
    description: 'Delete role',
    notes: 'Deletes a role by the id passed in the path with the attributes provided in the request body',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      params: {
        role_id: Joi.number().integer().required().min(0).description('the id for the role')
      }
    }
  }
}];
