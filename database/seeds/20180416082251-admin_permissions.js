'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 
    const entities = [];

    entities.push({ action: 'admin_sign_in_as', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'admin_sign_out_as', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'admin_sign_in_as',
          'admin_sign_out_as'
        ]
      }
    });
  }
};
