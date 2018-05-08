'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    const entities = [];

    entities.push({ action: 'accounts_accounts_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'accounts_accounts_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'accounts_accounts_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'accounts_accounts_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'accounts_accounts_destroy', created_at: new Date(), updated_at: new Date() });

    entities.push({ action: 'roles_roles_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'roles_roles_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'roles_roles_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'roles_roles_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'roles_roles_destroy', created_at: new Date(), updated_at: new Date() });

    entities.push({ action: 'permissions_permissions_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'permissions_permissions_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'permissions_permissions_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'permissions_permissions_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'permissions_permissions_destroy', created_at: new Date(), updated_at: new Date() });

    entities.push({ action: 'account_auth_sign_in', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'account_auth_sign_up', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('permissions', null, {});
  }
};
