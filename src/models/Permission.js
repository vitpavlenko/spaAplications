'use strict';

const uniqueValidator = require('../utils/validators/unique');

module.exports = (sequelize, DataTypes) => {
  
  const Role = sequelize.import('./Role.js');
  const RolePermission = sequelize.import('./RolePermission');

  const Permission = sequelize.define('permission', {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        uniqueAction: uniqueValidator('action', 'A permission with this action already exists')
      }
    },
    frontend: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    defaultScope: {
      include: [{
        model: Role,
        attributes: ['id', 'name']
      }]
    }
  });

  Role.belongsToMany(Permission, { through: RolePermission });
  Permission.belongsToMany(Role, { through: RolePermission });

  return Permission;
};