'use strict';

module.exports = {
  up: (queryInterface) => {

    const entities = [];

    entities.push({ action: 'posts_posts_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'posts_posts_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'posts_posts_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'posts_posts_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'posts_posts_destroy', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'posts_posts_index',
          'posts_posts_create',
          'posts_posts_show',
          'posts_posts_update',
          'posts_posts_destroy'
        ]
      }
    });
  }
};
