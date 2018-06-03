'use strict';

module.exports = {
  up: (queryInterface) => {

    const entities = [];

    entities.push({ action: 'spas_spas_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'spas_spas_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'spas_spas_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'spas_spas_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'spas_spas_destroy', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'spas_spas_index',
          'spas_spas_create',
          'spas_spas_show',
          'spas_spas_update',
          'spas_spas_destroy'
        ]
      }
    });
  }
};
