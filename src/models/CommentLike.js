'use strict';

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.import('./User.js');
  const Comment = sequelize.import('./Comment.js');

  const CommentLike = sequelize.define('comment_like', {}, {
    timestamps: true,
    underscored: true
  });

  CommentLike.belongsTo(User, { foreignKey: 'author_id' });
  CommentLike.belongsTo(Comment, { foreignKey: 'comment_id' });

  return CommentLike;
};