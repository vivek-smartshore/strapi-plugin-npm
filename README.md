## GraphQL Support

This plugin automatically enables `@strapi/plugin-graphql` with default settings.  
To customize, add to `config/plugins.js`:

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
