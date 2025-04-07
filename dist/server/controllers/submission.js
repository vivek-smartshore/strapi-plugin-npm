"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const helpers_1 = require("./helpers");
const types_1 = require("../types");
const contentTypeUID = types_1.FBContentTypes.FB_SUBMISSIONS;
exports.default = strapi_1.factories.createCoreController(contentTypeUID, ({ strapi }) => ({
    async create(ctx) {
        const sanitizedInput = await (0, helpers_1.validateAndSanitizeInput)(ctx, contentTypeUID);
        const { results, e } = await strapi.plugin('form-builder').service('submission').create({
            data: sanitizedInput,
        });
        const sanitizedOutput = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, results);
        const sanitizedResults = await this.transformResponse(sanitizedOutput);
        // If error is returned, set response status and add error as part of response
        if (e) {
            sanitizedResults.error = e;
            ctx.status = 207;
        }
        return sanitizedResults;
    },
    async find(ctx) {
        const sanitizedQuery = await (0, helpers_1.validateAndSanitizeQuery)(ctx, contentTypeUID);
        const { results, pagination } = await strapi.plugin('form-builder').service('submission').find(sanitizedQuery);
        const sanitizedResults = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, results);
        return await this.transformResponse(sanitizedResults, { pagination });
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const sanitizedQuery = await (0, helpers_1.validateAndSanitizeQuery)(ctx, contentTypeUID);
        const submission = await strapi.plugin('form-builder').service('submission').findOne(id, sanitizedQuery);
        const sanitizedOutput = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, submission);
        return await this.transformResponse(sanitizedOutput);
    },
    async delete(ctx) {
        const { id } = ctx.params;
        const deletedSubmission = await strapi.plugin('form-builder').service('submission').delete(id);
        const sanitizedOutput = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, deletedSubmission);
        return await this.transformResponse(sanitizedOutput);
    },
}));
