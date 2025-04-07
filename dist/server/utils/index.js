"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableAdminOnlyFieldsGraphQL = exports.getAdminOnlyAttributes = void 0;
const getAdminOnlyAttributes = (contentType) => {
    return Object.keys(contentType.attributes).filter((attrName) => { var _a, _b, _c; return ((_c = (_b = (_a = contentType.attributes[attrName]) === null || _a === void 0 ? void 0 : _a.pluginOptions) === null || _b === void 0 ? void 0 : _b['form-builder']) === null || _c === void 0 ? void 0 : _c.adminOnly) === true; });
};
exports.getAdminOnlyAttributes = getAdminOnlyAttributes;
const disableAdminOnlyFieldsGraphQL = (extensionService, contentTypeUID) => {
    const adminOnlyFields = getAdminOnlyAttributes(strapi.getModel(contentTypeUID));
    if (adminOnlyFields.length > 0) {
        adminOnlyFields.forEach((attrName) => extensionService.shadowCRUD(contentTypeUID).field(attrName).disable());
    }
};
exports.disableAdminOnlyFieldsGraphQL = disableAdminOnlyFieldsGraphQL;
