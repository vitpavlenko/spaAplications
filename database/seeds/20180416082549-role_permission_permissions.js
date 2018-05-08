'use strict';

module.exports = {
  up: (queryInterface) => {

    const entities = [];

    entities.push({ action: 'role_permissions_role_permissions_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'role_permissions_role_permissions_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'role_permissions_role_permissions_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'role_permissions_role_permissions_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'role_permissions_role_permissions_destroy', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'role_permissions_role_permissions_index',
          'role_permissions_role_permissions_create',
          'role_permissions_role_permissions_show',
          'role_permissions_role_permissions_update',
          'role_permissions_role_permissions_destroy',
        ]
      }
    });
  }
};
