"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// module.exports = validateRequest;
exports.default = validateRequest;
function validateRequest(err, req, res, next, schema) {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map((x) => x.message).join(', ')}`);
    }
    else {
        req.body = value;
        next();
    }
}
