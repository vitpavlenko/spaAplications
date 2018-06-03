const sequelize = require('../db');

exports.User = sequelize.import('./User');

exports.Role = sequelize.import('./Role');
exports.Permission = sequelize.import('./Permission');
exports.RolePermission = sequelize.import('./RolePermission');
exports.UserRole = sequelize.import('./UserRole');

exports.Spa = sequelize.import('./Spa');
exports.Post = sequelize.import('./Post');
exports.PostLike = sequelize.import('./PostLike');
exports.Comment = sequelize.import('./Comment');
exports.CommentLike = sequelize.import('./CommentLike');
