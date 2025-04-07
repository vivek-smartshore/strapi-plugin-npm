"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeOutput = exports.validateAndSanitizeInput = exports.validateAndSanitizeQuery = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("@strapi/utils");
const types_1 = require("../types");
const utils_2 = require("../utils");
const validateAndSanitizeQuery = async (ctx, contentTypeUID) => {
    const contentType = strapi.contentType(contentTypeUID);
    await utils_1.validate.contentAPI.query(ctx.query, contentType, {
        auth: ctx.state.auth,
    });
    return await utils_1.sanitize.contentAPI.query(ctx.query, contentType, {
        auth: ctx.state.auth,
    });
};
exports.validateAndSanitizeQuery = validateAndSanitizeQuery;
const validateAndSanitizeInput = async (ctx, contentTypeUID) => {
    const contentType = strapi.contentType(contentTypeUID);
    const body = ctx.request.body || {};
    if (!(0, lodash_1.isObject)(body.data)) {
        throw new utils_1.errors.ValidationError('Missing "data" payload in the request body');
    }
    return await utils_1.sanitize.contentAPI.input(body.data, contentType, { auth: ctx.state.auth });
};
exports.validateAndSanitizeInput = validateAndSanitizeInput;
const sanitizeOutput = async (ctx, contentTypeUID, data) => {
    const contentType = strapi.contentType(contentTypeUID);
    const sanitizedEntity = await utils_1.sanitize.contentAPI.output(data, contentType, {
        auth: ctx.state.auth,
    });
    return filterAdminOnlyAttributes(ctx, contentTypeUID, sanitizedEntity);
};
exports.sanitizeOutput = sanitizeOutput;
const filterAdminOnlyAttributes = (ctx, contentTypeUID, data) => {
    const isContentAPIRequest = ctx.state.auth.strategy.name === 'users-permissions';
    if (isContentAPIRequest) {
        removeAdminOnlyAttributes(contentTypeUID, data);
    }
    return data;
};
const removeAdminOnlyAttributes = (contentTypeUID, data, parseRelations) => {
    const contentType = strapi.getModel(contentTypeUID);
    const adminOnlyAttributes = (0, utils_2.getAdminOnlyAttributes)(contentType);
    // There is only one relational attribute in each model schema created by the plugin
    const relationalAttribute = contentTypeUID === types_1.FBContentTypes.FB_FORMS ? 'submissions' : 'form';
    const processAdminAndRelationalAttributes = (entity) => {
        if (adminOnlyAttributes.length > 0) {
            adminOnlyAttributes.forEach((val) => {
                if ((0, lodash_1.has)(entity, val))
                    delete entity[val];
            });
        }
        // If relations are populated, filter fields in the relations data too.
        if (relationalAttribute && entity[relationalAttribute] && parseRelations !== false) {
            // Set parseRelations as false - we check only one-level nesting
            removeAdminOnlyAttributes(contentType.attributes[relationalAttribute]['target'], entity[relationalAttribute], false);
        }
    };
    if ((0, lodash_1.isPlainObject)(data)) {
        processAdminAndRelationalAttributes(data);
    }
    else if ((0, lodash_1.isArray)(data)) {
        data.map((entity) => {
            processAdminAndRelationalAttributes(entity);
        });
    }
};
