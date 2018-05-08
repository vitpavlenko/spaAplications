'use strict';

module.exports = (sequelize, DataTypes) => {
  
  const Role = sequelize.define('role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true//,
    // defaultScope: {
    //   include: [{
    //     model: Permission,
    //     attributes: ['id', 'action']
    //   }]
    // }
  });


  Role.prototype.toJSON = function () {

    const role = this.get(null, { plain: true });

    if (role.permissions) {
      role.permissions.forEach((permission) => delete permission.role_permission);
    }

    return role;

  };

  return Role;
};
