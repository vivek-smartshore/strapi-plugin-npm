"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    create: async (ctx) => {
        const formData = ctx.request.body;
        return await strapi
            .plugin('form-builder')
            .service('formSubmissionService')
            .create(formData);
    },
    find: async (ctx) => {
        const query = ctx.query;
        return await strapi
            .plugin('form-builder')
            .service('formSubmissionService')
            .find(query);
    },
    findOne: async (ctx) => {
        const subId = ctx.params.id;
        const query = ctx.query;
        return await strapi
            .plugin('form-builder')
            .service('formSubmissionService')
            .findOne(subId, query);
    },
    delete: async (ctx) => {
        const subId = ctx.params.id;
        return await strapi
            .plugin('form-builder')
            .service('formSubmissionService')
            .delete(subId);
    },
});
