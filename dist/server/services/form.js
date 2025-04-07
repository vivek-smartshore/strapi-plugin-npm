"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const uuid_1 = require("uuid");
const types_1 = require("../types");
const contentTypeUID = types_1.FBContentTypes.FB_FORMS;
exports.default = strapi_1.factories.createCoreService(contentTypeUID, ({ strapi }) => ({
    async create(params) {
        var _a;
        const { data } = params;
        const uuid = await strapi.plugins['content-manager'].services.uid.generateUIDField({
            contentTypeUID,
            field: 'uid',
            data,
        });
        data.uid = uuid;
        if (data.allFields) {
            data.allFields = data.allFields.map((field) => {
                field.id = (0, uuid_1.v4)();
                return field;
            });
        }
        // Return only ID field after create
        return await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.create(contentTypeUID, {
            ...params,
            data,
            fields: ['id'],
        }));
    },
    async find(query) {
        return super.find(query);
    },
    async findOne(id, query) {
        return super.findOne(id, query);
    },
    async update(id, data) {
        var _a, _b;
        if ((_a = data.data) === null || _a === void 0 ? void 0 : _a.allFields) {
            data.data.allFields = data.data.allFields.map((field) => {
                if (!field.id) {
                    field.id = (0, uuid_1.v4)();
                }
                return field;
            });
        }
        const updatedForm = await ((_b = strapi.entityService) === null || _b === void 0 ? void 0 : _b.update(contentTypeUID, id, data));
        return updatedForm;
    },
    async delete(id) {
        // Return only ID field after delete
        return super.delete(id, {
            fields: ['id'],
        });
    },
}));
