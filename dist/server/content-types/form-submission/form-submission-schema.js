"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "kind": "collectionType",
    "collectionName": "form_submissions",
    "info": {
        "singularName": "form-submission",
        "pluralName": "form-submissions",
        "displayName": "Form Submission (Form Builder)",
        "description": ""
    },
    "options": {
        "draftAndPublish": false
    },
    "pluginOptions": {
        "content-manager": {
            "visible": false
        },
        "content-type-builder": {
            "visible": false
        }
    },
    "attributes": {
        "form": {
            "type": "relation",
            "relation": "manyToOne",
            "target": "plugin::form-builder.form",
            "inversedBy": "submissions",
            "required": true,
        },
        "slug": {
            "type": "uid",
            "required": true
        },
        "submitted_data": {
            "type": "json",
            "required": true,
            "pluginOptions": {
                "form-builder": {
                    "readOnly": true
                }
            },
        },
    }
};
