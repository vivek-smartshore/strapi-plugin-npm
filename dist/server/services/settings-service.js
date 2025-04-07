"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const settingsService = ({ strapi }) => ({
    setSettings: async (data) => {
        const value = data;
        const pluginStore = (0, helper_1.getPluginStore)(strapi);
        await (pluginStore === null || pluginStore === void 0 ? void 0 : pluginStore.set({ key: 'settings', value }));
        return pluginStore === null || pluginStore === void 0 ? void 0 : pluginStore.get({ key: 'settings' });
    },
    getSettings: async () => {
        const pluginStore = (0, helper_1.getPluginStore)(strapi);
        let config = await (pluginStore === null || pluginStore === void 0 ? void 0 : pluginStore.get({ key: 'settings' }));
        if (!config) {
            config = await (0, helper_1.createDefaultConfig)(strapi);
        }
        return config;
    },
});
exports.default = settingsService;
