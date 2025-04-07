"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_1 = __importDefault(require("./form"));
const submission_1 = __importDefault(require("./submission"));
exports.default = {
    form: { schema: form_1.default },
    submission: { schema: submission_1.default },
};
