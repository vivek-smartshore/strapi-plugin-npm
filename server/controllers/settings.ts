import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  setSettings: async (ctx) => {
    const { body } = ctx.request
    try {
      await strapi.plugin('form-builder').service('settings').setSettings(body)
      ctx.body = await strapi.plugin('form-builder').service('settings').getSettings()
    } catch (err) {
      ctx.throw(500, err)
    }
  },
  getSettings: async (ctx) => {
    try {
      ctx.body = await strapi.plugin('form-builder').service('settings').getSettings()
    } catch (err) {
      ctx.throw(500, err)
    }
  },
})
