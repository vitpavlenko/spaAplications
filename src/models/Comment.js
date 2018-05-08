'use strict';

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.import('./User.js');
  const Post = sequelize.import('./Post.js');

  const Comment = sequelize.define('comment', {
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Comment.belongsTo(User, { foreignKey: 'author_id' });
  Comment.belongsTo(Post, { foreignKey: 'post_id' });

  return Comment;
};