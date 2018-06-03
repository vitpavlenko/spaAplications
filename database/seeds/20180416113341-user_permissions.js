'use strict';

module.exports = {
  up: (queryInterface) => {

    const entities = [];

    entities.push({ action: 'users_users_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'users_users_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'users_users_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'users_users_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'users_users_destroy', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'users_users_index',
          'users_users_create',
          'users_users_show',
          'users_users_update',
          'users_users_destroy'
        ]
      }
    });
  }
};
