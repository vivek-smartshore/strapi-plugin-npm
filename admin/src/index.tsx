import { prefixPluginTranslations } from '@strapi/helper-plugin'
import { Relation } from '@strapi/icons'
import pluginPkg from '../../package.json'
import pluginId from './pluginId'
import Initializer from './components/Initializer'
import PluginIcon from './components/PluginIcon'
import getTrad from './utils/getTrad'

const name = pluginPkg.strapi.displayName

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import('./pages/App')

        return component
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    })

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: 'Forms',
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: 'General settings',
          },
          id: 'settings',
          to: `/settings/${pluginId}`,
          Component: async () => {
            return import('./pages/SettingsPage')
          },
        },
      ]
    )

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    }

    app.registerPlugin(plugin)

    app.customFields.register({
      name: 'form-relation-id',
      pluginId: pluginId,
      type: 'integer',
      intlLabel: {
        id: 'form-builder.form-relation-id.label',
        defaultMessage: 'Form relation',
      },
      intlDescription: {
        id: 'form-builder.form-relation-id.description',
        defaultMessage: 'Select a form',
      },
      icon: Relation,
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ './components/CustomFields/FormRelation'),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('form.attribute.item.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('form.attribute.item.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    })
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            }
          })
          .catch(() => {
            return {
              data: {},
              locale,
            }
          })
      })
    )

    return Promise.resolve(importedTrads)
  },
}
