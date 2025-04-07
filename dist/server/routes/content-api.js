"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'content-api',
    routes: [
        // Forms
        {
            method: 'GET',
            path: '/forms',
            handler: 'form.find',
        },
        {
            method: 'GET',
            path: '/forms/:id',
            handler: 'form.findOne',
        },
        // Form Submissions
        {
            method: 'POST',
            path: '/submissions',
            handler: 'submission.create',
        },
        {
            method: 'GET',
            path: '/submissions',
            handler: 'submission.find',
        },
        {
            method: 'GET',
            path: '/submissions/:id',
            handler: 'submission.findOne',
        },
    ],
};
