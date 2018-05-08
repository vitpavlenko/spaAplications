'use strict';

/**
 * @module utils/validators/unique
 */

/**
 * Builds a uniqueness validator function for specific attribute. It is strongly recommended for the attribute to be under a unique constraint (unique index) in the DB.
 * The function returned by this builder should be referenced in "validate" attribute option during model definition.
 * @param {string} attribute - An attribute field to check for uniqueness.
 * @param {string} [customMessage] - Custom error message.
 * @throws {Error} Throws an error if attribute field is not specified.
 * @returns {uniqueValidator} A unique constraint validator used by Sequelize.
 */
module.exports = function (attribute, customMessage) {

    if (!attribute) {
        throw new Error('"attribute" argument is missing');
    }

    /**
     * A unique constraint validator. Checks attribute field value of a model instance for uniqueness. If value is null, the validation is bypassed according to UNIQUE constraint behaviour in SQL.
     * This function should NOT be used directly - Sequelize calls it automatically, providing the actual attribute value during validation.
     * @function uniqueValidator
     * @async
     * @param {?*} value Attribute field value (provided by Sequelize)
     * @throws {Error} Throws an error if an instance with the same attribute value exists in the table (UNIQUE constraint violation).
     */
    return async function uniqueValidator(value) {

        if (!value) {
            return; // Bypass validation if no value or null value
        }

        const query = { where: {} };

        query.where[attribute] = value;

        const record = await this.constructor.findOne(query);

        if (record) {

            const message = customMessage || `"${attribute}" is not unique`;
            throw new Error(message);
        }
    };
};
