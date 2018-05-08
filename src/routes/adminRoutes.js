'use strict';
const Joi = require('joi');

const { AsyncAdapter: AdminController } = require('../controllers/admin_controller');
const reformatValidationOutput = require('../utils/reformatValidationoutput');

module.exports = [{
  path: '/api/admin/sign_in_as',
  method: 'POST',
  handler: AdminController.signInAs,
  config: {
    auth: 'token',
    description: 'Sign in under somebody else',
    tags: ['api'],
    validate: {
      options: { abortEarly: false },
      failAction: reformatValidationOutput,
      payload: {
        resign_account_id: Joi.number().integer().min(0).description('The id of the user it is needed to sign in under')
      }
    }
  }
}, {
  path: '/api/admin/sign_out_as',
  method: 'POST',
  handler: AdminController.signOutAs,
  config: {
    auth: 'token',
    description: 'Log out of the resigned user account',
    tags: ['api']
  }
}];

