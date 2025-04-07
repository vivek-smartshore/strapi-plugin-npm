"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'admin',
    routes: [
        // Forms
        {
            method: 'POST',
            path: '/forms',
            handler: 'form.create',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.forms.create'],
                        },
                    },
                ],
            },
        },
        {
            method: 'GET',
            path: '/forms',
            handler: 'form.find',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.forms.read'],
                        },
                    },
                ],
            },
        },
        {
            method: 'GET',
            path: '/forms/:id',
            handler: 'form.findOne',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.forms.read'],
                        },
                    },
                ],
            },
        },
        {
            method: 'PUT',
            path: '/forms/:id',
            handler: 'form.update',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.forms.update'],
                        },
                    },
                ],
            },
        },
        {
            method: 'DELETE',
            path: '/forms/:id',
            handler: 'form.delete',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.forms.delete'],
                        },
                    },
                ],
            },
        },
        // Form Submissions
        {
            method: 'GET',
            path: '/submissions',
            handler: 'submission.find',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.submissions.read'],
                        },
                    },
                ],
            },
        },
        {
            method: 'GET',
            path: '/submissions/:id',
            handler: 'submission.findOne',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.submissions.read'],
                        },
                    },
                ],
            },
        },
        {
            method: 'DELETE',
            path: '/submissions/:id',
            handler: 'submission.delete',
            config: {
                policies: [
                    'admin::isAuthenticatedAdmin',
                    {
                        name: 'admin::hasPermissions',
                        config: {
                            actions: ['plugin::form-builder.submissions.delete'],
                        },
                    },
                ],
            },
        },
        // Settings for admin
        {
            method: 'GET',
            path: '/settings',
            handler: 'settings.getSettings',
            config: {
                policies: [],
            },
        },
        {
            method: 'POST',
            path: '/settings',
            handler: 'settings.setSettings',
            config: {
                policies: [],
            },
        },
    ],
};
