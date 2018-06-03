'use strict';

/**
 * @module utils/validators/foreignExists
 */

/**
 * Builds an associated record existence validator function for specific foreign key attribute. It is strongly recommended for the attribute to be under a foreign key constraint in the DB.
 * The function returned by this builder should be referenced in "validate" attribute option during model definition.
 * @param {string} attribute - An attribute field of the foreign key.
 * @param {Sequelize.Model} foreignModel - A Sequelize model of the associated entity.
 * @throws {Error} Throws an error if attribute field is not specified.
 * @throws {Error} Throws an error if foreignModel is not specified.
 * @param {string} [customMessage] - Custom error message.
 * @returns {foreignExistsValidator} A foreign key constraint validator used by Sequelize.
 */
module.exports = function (attribute, foreignModel, customMessage) {

    if (!attribute) {
        throw new Error('"attribute" argument is missing');
    }

    if (!foreignModel) {
        throw new Error('"foreignModel" argument is missing');
    }

    /**
     * A foreign key constraint validator. Checks the associated model instance, id of which is the attribute field value, for existence. If value is null, the validation is bypassed according to FOREIGN KEY constraint behaviour in SQL.
     * This function should NOT be used directly - Sequelize calls it automatically, providing the actual attribute value during validation.
     * @function foreignExistsValidator
     * @async
     * @param {?*} value Attribute field value (provided by Sequelize)
     * @throws {Error} Throws an error if the associated record does not exist (FOREIGN KEY constraint violation).
     */
    return async function foreignExistsValidator(value) {

        if (!value) {
            return; // Bypass validation if no value or null value
        }

        const record = await foreignModel.findById(value);

        if (!record) {

            const message = customMessage || `"${attribute}" foreign key does not match any existing record`;
            throw new Error(message);
        }
    };
};
