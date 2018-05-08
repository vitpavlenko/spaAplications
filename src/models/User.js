// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const uniqueValidator = require('../utils/validators/unique');
// const boom = require('boom');

const { uniqBy } = require('lodash');

class PasswordMismatchError extends Error {
    constructor(message) {

        super(message || 'Incorrect password');
    }
}

module.exports = function (sequelize, DataTypes) {

    const Role = sequelize.import('./Role.js');
    const Permission = sequelize.import('./Permission');
    const UserRole = sequelize.import('./UserRole.js');

    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                uniqueEmail: uniqueValidator('email', 'Email already exists')
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        permissions: {
            type: DataTypes.VIRTUAL
        }
    }, {
            timestamps: true,
            underscored: true,
            paranoid: true,
            defaultScope: {
                include: [{
                    model: Role.unscoped(),
                    attributes: ['id', 'name']
                }]
            }
        });

        User.belongsToMany(Role, { through: UserRole });
        Role.belongsToMany(User, { through: UserRole });      

    User.prototype.hasPermission = async function (action) {

        const permissions = await this.getPermissions();

        return permissions.some(p => (p.action === action));
    };

    User.prototype.getPermissions = async function () {
        try {
            let permissions = await Permission.findAll({
                include: [{
                    model: Role,
                    attributes: ['id'],
                    required: true,
                    include: [{
                        model: User,
                        attributes: ['id'],
                        where: { id: this.id },
                        required: true
                    }]
                }]
            });

            const authorizedRole = await Role.findOne({ where: { name: 'authorized' } });
            if (authorizedRole) {
                const authorizedPermissions = await authorizedRole.getPermissions();
                permissions = permissions.concat(authorizedPermissions);
            }

            return uniqBy(permissions, 'id')
                .map(p => ({
                    id: p.id,
                    action: p.action,
                    frontend: p.frontend
                }));

        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    User.prototype.getFrontendPermissions = async function () {

        try {
            const permissions = await this.getPermissions();

            return permissions
                .filter(p => p.frontend)
                .map(p => ({
                    id: p.id,
                    action: p.action
                }));

        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    Permission.prototype.getUsers = async function () {

        return User.findAll({
            include: [{
                model: Role,
                attributes: ['id', 'name'],
                required: true,
                include: [{
                    model: Permission,
                    attributes: ['id', 'action'],
                    where: { id: this.id },
                    required: true
                }]
            }]
        });
    };

    const hashPassword = async function (user) {

        if (!user.changed('password')) {
            return;
        }

        const hash = await bcrypt.hash(user.get('password'), 10);

        user.set('password', hash);
    };

    User.beforeCreate(hashPassword);
    User.beforeUpdate(hashPassword);

    User.prototype.toJSON = function () {

        const user = this.get(null, { plain: true });

        delete user.password;

        if (user.roles) {
            user.roles.forEach((role) => delete role.user_role);
        }

        return user;

    };

    User.PasswordMismatchError = PasswordMismatchError;

    User.prototype.authenticate = async function (password) {

        const validPassword = await bcrypt.compare(password, this.get('password'));

        if (!validPassword) {
            throw new this.constructor.PasswordMismatchError();
        }

        return this;
    };

    User.prototype.updatePassword = async function (password) {

        await this.update({ password });
    
        // await sendEmail({
        //   to: this.get('email'),
        //   subject: 'Password Has Been Updated',
        //   html: `
        //           <p>Hello, ${this.get('email')}</p>
        //           <p>Your password has been updated.</p>
        //           <p>If you didn't request this, please contact the support.</p>
        //         `
        // });
      };

    return User;
};
