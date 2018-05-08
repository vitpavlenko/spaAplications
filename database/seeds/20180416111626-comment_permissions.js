'use strict';

module.exports = {
  up: (queryInterface) => {

    const entities = [];

    entities.push({ action: 'comments_comments_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comments_comments_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comments_comments_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comments_comments_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comments_comments_destroy', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'comments_comments_index',
          'comments_comments_create',
          'comments_comments_show',
          'comments_comments_update',
          'comments_comments_destroy'
        ]
      }
    });
  }
};