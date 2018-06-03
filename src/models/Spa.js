'use strict';

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.import('./User.js');

  const Spa = sequelize.define('spa', {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    code: {
        type: DataTypes.TEXT,
        allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true
  });

  Spa.belongsTo(User, { foreignKey: 'author_id' });
  
  return Spa;
};