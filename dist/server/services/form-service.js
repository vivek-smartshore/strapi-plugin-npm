"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
exports.default = ({ strapi }) => ({
    create: async (data) => {
        var _a;
        const formData = data.data;
        const uuid = await strapi.plugins['content-manager'].services.uid.generateUIDField({
            contentTypeUID: "plugin::form-builder.form",
            field: "uid",
            data: formData,
        });
        formData.uid = uuid;
        if (formData.allFields) {
            formData.allFields = formData.allFields.map((field) => {
                field.id = (0, uuid_1.v4)();
                return field;
            });
        }
        const newForm = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.create("plugin::form-builder.form", { data: formData }));
        return newForm;
    },
    find: async (query) => {
        var _a, _b;
        const allForms = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findMany("plugin::form-builder.form", query));
        const totalCount = await ((_b = strapi.entityService) === null || _b === void 0 ? void 0 : _b.count("plugin::form-builder.form"));
        return {
            results: allForms,
            count: totalCount,
        };
    },
    findOne: async (formId, query) => {
        var _a;
        const singleForm = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findOne("plugin::form-builder.form", formId, query));
        return singleForm;
    },
    update: async (formId, data) => {
        var _a, _b;
        if ((_a = data.data) === null || _a === void 0 ? void 0 : _a.allFields) {
            data.data.allFields = data.data.allFields.map((field) => {
                if (!field.id) {
                    field.id = (0, uuid_1.v4)();
                }
                return field;
            });
        }
        const updatedForm = await ((_b = strapi.entityService) === null || _b === void 0 ? void 0 : _b.update("plugin::form-builder.form", formId, data));
        return updatedForm;
    },
    delete: async (formId) => {
        var _a;
        await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.delete("plugin::form-builder.form", formId));
        return { id: formId };
    },
});
