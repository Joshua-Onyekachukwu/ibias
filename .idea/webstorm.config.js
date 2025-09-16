// WebStorm configuration for Tailwind CSS support
module.exports = {
  // Enable PostCSS support
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  // CSS language settings
  css: {
    validate: false,
    lint: {
      unknownAtRules: 'ignore'
    }
  }
};