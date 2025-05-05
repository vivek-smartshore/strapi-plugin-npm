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

### 📦 Environment Variables

To enable email notifications for form submissions, add the following to your `.env` file:

- TO_EMAIL=your-receiving@email.com
- FROM_EMAIL=your-sending@email.com

These variables define the sender and recipient email addresses for submission notifications.

### 📑 [How to Add Form to a Page](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/form-configure-guide.md)

### 🌐 [Frontend Integration Guide](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/frontend.md) on GitHub.

### ⚙️ [Plugin Settings Guide](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/form-plugin-settings.md) on GitHub.

### 📸 Helpful Screenshots

Here are some visual steps to guide you through setup:

### 1. Add Field in Content-Type Builder

![Add Field](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/screenshots/content-type-builder.png?raw=true)

### 2. Use Form Picker in Content Manager

![Use Form Picker](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/screenshots/select-form.png?raw=true)

### 3. Form Edit Page Overview

This screenshot shows the **Form Edit** page where you can:

- Set the form name and submit button text
- Enable or disable confirmation email settings
- Configure email subject and content
- Add, edit, and reorder form fields
- View form metadata like creation and update timestamps

![Form Edit Page](https://github.com/vivek-smartshore/strapi-plugin-npm/blob/main/docs/screenshots/form-edit-page.png?raw=true)

## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to suggest features or report bugs.
here: [GitHub Repository Link](https://github.com/vivek-smartshore/strapi-plugin-npm)
