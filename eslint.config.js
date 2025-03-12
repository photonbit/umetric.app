module.exports = [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: require('@babel/eslint-parser'),

      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      babel: require('@babel/eslint-plugin'),
      nozbe: require('@nozbe/eslint-plugin-nozbe'),
    },
    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
