'use strict';

module.exports = {
  up: (queryInterface) => {

    const entities = [];

    entities.push({ action: 'comment_likes_comment_likes_index', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comment_likes_comment_likes_create', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comment_likes_comment_likes_show', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comment_likes_comment_likes_update', created_at: new Date(), updated_at: new Date() });
    entities.push({ action: 'comment_likes_comment_likes_destroy', created_at: new Date(), updated_at: new Date() });

    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('permissions', {
      action: {
        [Op.in]: [
          'comment_likes_comment_likes_index',
          'comment_likes_comment_likes_create',
          'comment_likes_comment_likes_show',
          'comment_likes_comment_likes_update',
          'comment_likes_comment_likes_destroy',
        ]
      }
    });
  }
};
