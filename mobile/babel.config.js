const fs = require('fs');
const path = require('path');

const readEnvValue = (contents, name) => {
  const line = contents.split(/\r?\n/).find((item) => {
    return new RegExp(`^\\s*${name}\\s*=`).test(item);
  });

  if (!line) {
    return '';
  }

  return line
    .replace(new RegExp(`^\\s*${name}\\s*=`), '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
};

module.exports = function (api) {
  const envFile = process.env.ENVFILE || '.env';
  const envPath = path.resolve(__dirname, envFile);

  api.cache.using(() => `${envFile}:${process.env.WIWITAN_BUILD_ENV || ''}`);

  if (!fs.existsSync(envPath)) {
    throw new Error(`Mobile env file was not found: ${envFile}`);
  }

  if (process.env.NODE_ENV === 'production' && !process.env.ENVFILE) {
    throw new Error(
      'Production JavaScript bundling requires an explicit ENVFILE. ' +
        'Use .env.production for a production build or .env for local QA.'
    );
  }

  const envContents = fs.readFileSync(envPath, 'utf8');
  const isProductionEnv =
    process.env.WIWITAN_BUILD_ENV === 'production' ||
    path.basename(envPath).toLowerCase() === '.env.production';

  if (isProductionEnv) {
    const status = readEnvValue(envContents, 'STATUS');
    const apiUrl = readEnvValue(envContents, 'API_URL');
    const cmsUrl = readEnvValue(envContents, 'URL_CMS');
    const autoLoginEmail = readEnvValue(envContents, 'AUTO_LOGIN_EMAIL');
    const autoLoginPassword = readEnvValue(envContents, 'AUTO_LOGIN_PASSWORD');

    if (status !== 'PRODUCTION') {
      throw new Error(`Production build requires STATUS=PRODUCTION in ${envFile}`);
    }
    if (!/^https:\/\//i.test(apiUrl) || !/^https:\/\//i.test(cmsUrl)) {
      throw new Error(`Production build requires HTTPS API_URL and URL_CMS in ${envFile}`);
    }
    if (autoLoginEmail || autoLoginPassword) {
      throw new Error(`Production build must not contain AUTO_LOGIN credentials in ${envFile}`);
    }
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: envFile,
          allowUndefined: true,
        },
      ],

      // Your path aliases
      [
        'module-resolver',
        {
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            components: './src/components',
            screens: './src/screens',
            assets: './src/assets',
            navigations: './src/navigations',
            types: './src/types',
            utils: './src/utils',
            stores: './src/stores',
            hooks: './src/hooks',
            configs: './src/configs',
            managers: './src/managers',
            services: './src/services',
            atoms: './src/atoms',
          },
        },
      ],

      // Must always be last
      'react-native-reanimated/plugin',
    ],
  };
};
