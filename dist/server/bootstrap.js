"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RBAC_ACTIONS = [
    {
        section: 'plugins',
        subCategory: 'Forms',
        displayName: 'Create',
        uid: 'forms.create',
        pluginName: 'form-builder',
    },
    {
        section: 'plugins',
        subCategory: 'Forms',
        displayName: 'Read',
        uid: 'forms.read',
        pluginName: 'form-builder',
    },
    {
        section: 'plugins',
        subCategory: 'Forms',
        displayName: 'Update',
        uid: 'forms.update',
        pluginName: 'form-builder',
    },
    {
        section: 'plugins',
        subCategory: 'Forms',
        displayName: 'Delete',
        uid: 'forms.delete',
        pluginName: 'form-builder',
    },
    {
        section: 'plugins',
        subCategory: 'Form Submissions',
        displayName: 'Create',
        uid: 'submissions.create',
        pluginName: 'form-builder',
    },
    {
        section: 'plugins',
        subCategory: 'Form Submissions',
        displayName: 'Read',
        uid: 'submissions.read',
        pluginName: 'form-builder',
    },
    {
        section: 'plugins',
        subCategory: 'Form Submissions',
        displayName: 'Update',
        uid: 'submissions.update',
        pluginName: 'form-builder',
    },
    {
        section: 'plugins',
        subCategory: 'Form Submissions',
        displayName: 'Delete',
        uid: 'submissions.delete',
        pluginName: 'form-builder',
    },
];
exports.default = async ({ strapi }) => {
    var _a, _b, _c;
    await ((_a = strapi.admin) === null || _a === void 0 ? void 0 : _a.services.permission.actionProvider.registerMany(RBAC_ACTIONS));
    // Cascade delete workaround. Delete related submissions before deleting forms.
    (_b = strapi.db) === null || _b === void 0 ? void 0 : _b.lifecycles.subscribe({
        models: ['plugin::form-builder.form'],
        async beforeDelete(event) {
            var _a, _b;
            const { params } = event;
            const formId = params.where.id;
            const relatedSubs = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findMany('plugin::form-builder.submission', {
                filters: {
                    form: formId,
                },
                fields: ['id'],
            }));
            if (relatedSubs) {
                const subsToDelete = relatedSubs;
                const subIds = subsToDelete.map((sub) => sub.id);
                await ((_b = strapi.db) === null || _b === void 0 ? void 0 : _b.query('plugin::form-builder.submission').deleteMany({
                    where: {
                        id: {
                            $in: subIds,
                        },
                    },
                }));
                strapi.log.info(`Deleted submissions: ${JSON.stringify(subIds)}`);
            }
        },
    });
    // Update form submissions count on submission creation
    (_c = strapi.db) === null || _c === void 0 ? void 0 : _c.lifecycles.subscribe({
        models: ['plugin::form-builder.submission'],
        async afterCreate(event) {
            var _a, _b;
            const { params } = event;
            const formId = params.data.form;
            const submissionsCount = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.count('plugin::form-builder.submission', {
                filters: {
                    form: formId,
                },
            }));
            const data = {
                submissionsCount,
            };
            await ((_b = strapi.entityService) === null || _b === void 0 ? void 0 : _b.update('plugin::form-builder.form', formId, {
                data,
            }));
        },
    });
};
