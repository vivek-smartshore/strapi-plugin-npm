# Strapi Form Builder

A powerful form-building plugin for Strapi CMS, built by official and experienced Strapi partner Smartshore.

## 🚀 Installation

Install the plugin in your Strapi project:

```bash
npm install strapi-form-builder
# or
yarn add strapi-form-builder

```

## GraphQL Support

This plugin requires `@strapi/plugin-graphql` to be installed in your Strapi project.
After installing this plugin, run:

```js
npm install @strapi/plugin-graphql@4.25.5
# or
yarn add @strapi/plugin-graphql@4.25.5
```

### 🔧 Requirements

This plugin requires Strapi v4 and compatible Node.js versions:

- For Strapi v4.0.0 to v4.3.8 → Node.js **14.x** or **16.x**
- For Strapi v4.3.9 to v4.14.x → Node.js **18.x**
- From Strapi v4.15+ → Node.js **18.x** or **20.x**

Ensure your Node.js version matches the Strapi version you're using.

### 📑 How to Add Form Picker to Page

1. Go to **Content-Type Builder**.
2. Select the **Page** collection type.
3. Click **Add another field to this collection type**.
4. Select the **Custom** tab.
5. Click the **Form Relation** button and create a relation to the **Form** collection type.
6. Name the field `form_picker`.
7. Finish and save the changes.

### 🖱️ Using the Form Picker

1. Go to **Content Manager**.
2. Select **Page** and edit an existing page.
3. Under the **"Select Form"** dropdown, choose a **published form** to render on that page.

Now, the selected form will be rendered on the page based on your choice.

### 📸 Helpful Screenshots

Here are some visual steps to guide you through setup:

### 1. Add Field in Content-Type Builder

![Add Field](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/screenshots/content-type-builder.png?raw=true)

### 2. Use Form Picker in Content Manager

![Use Form Picker](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/screenshots/select-form.png?raw=true)

## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to suggest features or report bugs.
here: [GitHub Repository Link](https://github.com/vivek-smartshore/strapi-plugin-npm)
