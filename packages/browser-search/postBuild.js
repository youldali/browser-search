const fse = require('fs-extra')
const path = require('path');

const e2eScriptDir = path.resolve(__dirname, '../e2e/public/script')
const distDir = path.resolve(__dirname, 'dist')


const copyBuildToE2E = async () => {
  console.info('Emptying E2E script dir')
  await fse.emptyDir(e2eScriptDir);

  console.info('Copying dist into E2E script dir')
  await fse.copy(distDir, e2eScriptDir);
}

const run = async () => {
  await copyBuildToE2E();
}

run();