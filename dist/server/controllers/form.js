"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const helpers_1 = require("./helpers");
const types_1 = require("../types");
const contentTypeUID = types_1.FBContentTypes.FB_FORMS;
exports.default = strapi_1.factories.createCoreController(contentTypeUID, ({ strapi }) => ({
    async create(ctx) {
        const sanitizedInput = await (0, helpers_1.validateAndSanitizeInput)(ctx, contentTypeUID);
        const newForm = await strapi.plugin('form-builder').service('form').create({
            data: sanitizedInput,
        });
        const sanitizedOutput = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, newForm);
        return await this.transformResponse(sanitizedOutput);
    },
    async find(ctx) {
        const sanitizedQuery = await (0, helpers_1.validateAndSanitizeQuery)(ctx, contentTypeUID);
        // Returns only published forms by default
        const { results, pagination } = await strapi.plugin('form-builder').service('form').find(sanitizedQuery);
        const sanitizedResults = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, results);
        return await this.transformResponse(sanitizedResults, { pagination });
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const sanitizedQuery = await (0, helpers_1.validateAndSanitizeQuery)(ctx, contentTypeUID);
        const form = await strapi.plugin('form-builder').service('form').findOne(id, sanitizedQuery);
        const sanitizedOutput = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, form);
        return await this.transformResponse(sanitizedOutput);
    },
    async update(ctx) {
        const { id } = ctx.params;
        const sanitizedQuery = await (0, helpers_1.validateAndSanitizeQuery)(ctx, contentTypeUID);
        const sanitizedInput = await (0, helpers_1.validateAndSanitizeInput)(ctx, contentTypeUID);
        const updatedForm = await strapi
            .plugin('form-builder')
            .service('form')
            .update(id, {
            ...sanitizedQuery,
            data: sanitizedInput,
        });
        const sanitizedOutput = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, updatedForm);
        return await this.transformResponse(sanitizedOutput);
    },
    async delete(ctx) {
        const { id } = ctx.params;
        const deletedForm = await strapi.plugin('form-builder').service('form').delete(id);
        const sanitizedOutput = await (0, helpers_1.sanitizeOutput)(ctx, contentTypeUID, deletedForm);
        return await this.transformResponse(sanitizedOutput);
    },
}));
