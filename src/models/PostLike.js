'use strict';

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.import('./User.js');
  const Post = sequelize.import('./Post.js');

  const PostLike = sequelize.define('post_like', {}, {
    timestamps: true,
    underscored: true
  });

  PostLike.belongsTo(User, { foreignKey: 'author_id' });
  PostLike.belongsTo(Post, { foreignKey: 'post_id' });

  return PostLike;
};