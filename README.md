## GraphQL Support

This plugin requires `@strapi/plugin-graphql` to be installed in your Strapi project.
After installing this plugin, run:

```js
npm install @strapi/plugin-graphql@4.25.5
# or
yarn add @strapi/plugin-graphql@4.25.5
```

## Configuration

GraphQL will be automatically enabled with default settings.
To customize, add configuration to `config/plugins.js`:

```js
module.exports = () => ({
  graphql: {
    enabled: true,
    config: {
      /* your settings */
    },
  },
})
```
