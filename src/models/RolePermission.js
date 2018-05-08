'use strict';

module.exports = (sequelize, DataTypes) => {
  
  const RolePermission = sequelize.define('role_permission', {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: true,
    underscored: true
  });
  
  return RolePermission;
};