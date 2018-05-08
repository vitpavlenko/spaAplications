'use strict';

const { User } = require('../models');

module.exports = async function validateJwtAuth(decoded, request) {

  const { email, resign_user_id } = decoded;

  const user = await User.findOne({ where: { email } });

  let resign_user;

  if (!user) {
    return { isValid: false};//, { account, resign_account }};
  }

  if (resign_user_id) {

    resign_user = await User.findById(resign_user_id);

    if (!resign_user) {
      return { isValid: false };//, { account, resign_account };
    }
  }

  return { isValid: true, credentials: { user, resign_user } };
};
