'use strict';

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.import('./User.js');
  const Spa = sequelize.import('./Spa.js');

  const Post = sequelize.define('post', {
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Post.belongsTo(User, { foreignKey: 'author_id' });
  Post.belongsTo(Spa, { foreignKey: 'spa_id' });

  return Post;
};