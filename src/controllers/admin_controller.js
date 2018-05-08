'use strict';
const { ValidationError } = require('sequelize');

const sequelize = require('../db');

const Boom = require('boom');

const { User } = require('../models');

const AsyncAdapter = require('../utils/AsyncAdapter');

const JWTsign = require('../utils/JWTsign');

const asyncInterface = [
  'signInAs',
  'signOutAs'
];

class AdminController {

  static get AsyncAdapter() {

    return AsyncAdapter.call(this, asyncInterface);
  }

  static async signInAs(request, h) {

    const {
      auth: { credentials: { user: signedUser } },
      payload: { resign_user_id: resignUserId }
    } = request;

    const permissionName = 'admin_sign_in_as';
    const hasPermission = await signedUser.hasPermission(permissionName);

    if (!hasPermission) {
      return h.forbidden(`You do not have ${permissionName} permission`);
    }

    const real_User = await User.findById(signedUser.id);
    real_User.permissions = await real_User.getFrontendPermissions();

    const user = await User.findById(resignUserId);
    user.permissions = await user.getFrontendPermissions();

    const token = JWTsign(real_User.email, resignUserId);

    return h.response({ user, real_User, token });
  }

  static async signOutAs(request, h) {

    const { auth: { credentials: { user: signedUser } } } = request;

    const permissionName = 'admin_sign_out_as';
    const hasPermission = await signedUser.hasPermission(permissionName);

    if (!hasPermission) {
      return h.forbidden(`You do not have ${permissionName} permission`);
    }

    const user = await User.findById(signedUser.id);
    user.permissions = await user.getFrontendPermissions();

    const token = JWTsign(user.email);

    return h.response({ user, token });
  }

  /**
   * Format Sequelize ValidationError errors list into a map with keys corresponding to paths (attributes) that triggered an error and values corresponding to error messages.
   * @param {Sequelize.ValidationErrorItem[]} errors - ValidationError.errors is usually expected.
   * @returns {Object} A map with keys organized as { path : message }.
   */
  static formatValidationErrors(errors) {

    const result = {};

    errors.forEach((err) => {

      if (!err.path) {
        throw new Error('error item lacks "path" property');
      }

      result[err.path] = err.message;
    });

    return result;
  }

  /**
   * An error handler for controller actions.
   * @param {Error} err
   * @param {Object} request - Hapi request object.
   * @param {Object} h - Hapi object.
   */
  static async onError(err, request, h) {

    if (err instanceof ValidationError) {

      const boomErr = Boom.badRequest(err.message);

      boomErr.output.payload.errors = this.formatValidationErrors(err.errors);

      return h.response(boomErr);
    }

    return err;
  }

}

AdminController.sequelize = sequelize;

AdminController.options = {
};

module.exports = AdminController;
