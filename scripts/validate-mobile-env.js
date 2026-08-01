const fs = require('fs');
const path = require('path');

const envFile = process.argv[2] || process.env.ENVFILE || '.env';
const mode = (process.argv[3] || 'development').toLowerCase();
const mobileRoot = path.resolve(__dirname, '..', 'mobile');
const envPath = path.isAbsolute(envFile) ? envFile : path.resolve(mobileRoot, envFile);

if (!fs.existsSync(envPath)) {
  console.error(`[FAIL] Mobile env file was not found: ${envFile}`);
  process.exit(1);
}

const values = {};
for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const line = rawLine.trim();
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (!match) {
    continue;
  }

  values[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
}

const fail = (message) => {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
};

if (!values.STATUS) {
  fail(`STATUS is required in ${envFile}`);
}

if (mode === 'production') {
  if (values.STATUS !== 'PRODUCTION') {
    fail(`production env must set STATUS=PRODUCTION in ${envFile}`);
  }
  if (!/^https:\/\//i.test(values.API_URL || '') || !/^https:\/\//i.test(values.URL_CMS || '')) {
    fail(`production env must use HTTPS for API_URL and URL_CMS in ${envFile}`);
  }
  if (values.AUTO_LOGIN_EMAIL || values.AUTO_LOGIN_PASSWORD) {
    fail(`production env must not contain AUTO_LOGIN credentials in ${envFile}`);
  }
  if (!values.URL_SCHEME) {
    fail(`URL_SCHEME is required in ${envFile}`);
  }
}

console.log(`[PASS] ${mode} mobile env validation passed for ${path.basename(envPath)}`);
