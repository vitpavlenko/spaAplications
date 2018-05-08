'use strict';
const { flatten } = require('lodash');

const accountRoutes = require('./userRoutes');
const authRoutes = require('./userAuthRoutes');
const roleRoutes = require('./roleRoutes');
const permissionRoutes = require('./permissionRoutes');
const role_persmissionRoutes = require('./role_permissionRoutes');
const adminRoutes = require('./adminRoutes');
const commentRoutes = require('./commentRoutes');
const comment_likeRoutes = require('./comment_likeRoutes');
const postRoutes = require('./postRoutes');
const post_likeRoutes = require('./post_likeRoutes');
const spaRoutes = require('./spaRoutes');

module.exports = flatten([
    authRoutes,
    accountRoutes,
    roleRoutes,
    permissionRoutes,
    role_persmissionRoutes,
    adminRoutes,
    commentRoutes,
    comment_likeRoutes,
    postRoutes,
    post_likeRoutes,
    spaRoutes
]);
