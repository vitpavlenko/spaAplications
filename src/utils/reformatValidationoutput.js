'use strict';

const buildErrorsObject = function (errorDetails, validationKeys) {

    const errors = {};
  
    validationKeys.forEach(key => (errors[key] = []));
  
    errorDetails.forEach(error => {
  
      if (Array.isArray(error.path)) {
        return error.path.forEach(path => errors[path].push(error.message));
      } 
  
      errors[error.path].push(error.message);
      
    });
  
    return errors;
  };
  
module.exports = async function (request, h, error ) {
  
    const errorDetails = error.details;
    const validationKeys = error.output.payload.validation.keys;
  
    error.output.payload.errors = buildErrorsObject(errorDetails, validationKeys);
  
    delete error.output.payload.validation;
    delete error.output.payload.message;
  
    return error;
};
  