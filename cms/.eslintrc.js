module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'eslint-config-prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.native.js'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'react/no-find-dom-node': 'off',
    'no-prototype-builtins': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    // 'no-unused-vars': 'off',
  },
};
