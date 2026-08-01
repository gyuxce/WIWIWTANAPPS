const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const envFile = args.shift();

if (!envFile || args.length === 0) {
  console.error('Usage: node run-android-gradle.js <env-file> <gradle-task> [args...]');
  process.exit(1);
}

const gradleCommand = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const envName = path.basename(envFile).toLowerCase();
const buildEnv = envName === '.env.production' ? 'production' : envName === '.env.staging' ? 'staging' : 'development';
const child = spawn(gradleCommand, args, {
  cwd: path.resolve(__dirname, '..', 'mobile', 'android'),
  env: {
    ...process.env,
    ENVFILE: envFile,
    WIWITAN_BUILD_ENV: buildEnv,
  },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(`[FAIL] Unable to start Gradle: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`[FAIL] Gradle exited with signal ${signal}`);
    process.exit(1);
  }
  process.exit(code === null ? 1 : code);
});
