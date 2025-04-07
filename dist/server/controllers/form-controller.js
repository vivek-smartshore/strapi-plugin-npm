"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    create: async (ctx) => {
        const formData = ctx.request.body;
        return await strapi
            .plugin('form-builder')
            .service('formService')
            .create(formData);
    },
    find: async (ctx) => {
        const query = ctx.query;
        return await strapi
            .plugin('form-builder')
            .service('formService')
            .find(query);
    },
    findOne: async (ctx) => {
        const formId = ctx.params.id;
        const query = ctx.query;
        return await strapi
            .plugin('form-builder')
            .service('formService')
            .findOne(formId, query);
    },
    update: async (ctx) => {
        const formId = ctx.params.id;
        const formData = ctx.request.body;
        return await strapi
            .plugin('form-builder')
            .service('formService')
            .update(formId, formData);
    },
    delete: async (ctx) => {
        const formId = ctx.params.id;
        return await strapi
            .plugin('form-builder')
            .service('formService')
            .delete(formId);
    },
});
