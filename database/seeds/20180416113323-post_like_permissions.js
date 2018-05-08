'use strict';

module.exports = {
  up: (queryInterface) => {

    const entities = [];

    entities.push({ action: 'post_likes_post_likes_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'post_likes_post_likes_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'post_likes_post_likes_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'post_likes_post_likes_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'post_likes_post_likes_destroy', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'post_likes_post_likes_index',
          'post_likes_post_likes_create',
          'post_likes_post_likes_show',
          'post_likes_post_likes_update',
          'post_likes_post_likes_destroy'
        ]
      }
    });
  }
};
