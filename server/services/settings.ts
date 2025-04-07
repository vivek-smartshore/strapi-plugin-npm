import { Strapi } from '@strapi/strapi'
import { getPluginStore, createDefaultConfig } from './helper'

const settingsService = ({ strapi }: { strapi: Strapi }) => ({
  setSettings: async (data) => {
    const value = data
    const pluginStore = getPluginStore(strapi)
    await pluginStore?.set({ key: 'settings', value })
    return pluginStore?.get({ key: 'settings' })
  },
  getSettings: async () => {
    const pluginStore = getPluginStore(strapi)
    let config = await pluginStore?.get({ key: 'settings' })
    if (!config) {
      config = await createDefaultConfig(strapi)
    }
    return config
  },
})

export default settingsService
