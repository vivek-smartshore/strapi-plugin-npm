"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_1 = __importDefault(require("./form"));
const submission_1 = __importDefault(require("./submission"));
const settings_1 = __importDefault(require("./settings"));
exports.default = {
    settings: settings_1.default,
    form: form_1.default,
    submission: submission_1.default,
};
