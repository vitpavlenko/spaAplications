'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('roles', [
      { name: 'admin', created_at: new Date(), updated_at: new Date() },
      { name: 'anonymous', created_at: new Date(), updated_at: new Date() }
    ])
      .then(() => queryInterface.sequelize.query('SELECT id FROM roles WHERE name=\'admin\' LIMIT 1', { plain: true }))
      .then((adminRole) => {

        return queryInterface.sequelize.query('SELECT id FROM permissions')
          .then((result) => result[0])
          .then((permissions) => {

            return queryInterface.bulkInsert('role_permissions', permissions.map((permission) => {

              return {
                role_id: adminRole.id,
                permission_id: permission.id,
                created_at: new Date(),
                updated_at: new Date()
              };
            }));
          });
      });
  },

  down: (queryInterface) => {

    return queryInterface.bulkDelete('roles', null, {});
  }
};
