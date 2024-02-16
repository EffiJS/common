const path = require('path');
const fs = require('fs');
const fx = require('mkdir-recursive');
const util = require('util');

const mkdir = util.promisify(fx.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const {
  projectRoot,
} = require('./utils');

async function createService(Name) {
  const name = Name.toLowerCase();
  const root = await projectRoot();

  const libPath = path.join(
    root,
    'node_modules',
    'react-native-start',
    'src',
    'cli',
    'source',
    'Service',
  );
  const servicePath = path.join(root, 'src', 'Services', Name);

  // Create folders
  await mkdir(path.join(servicePath, 'Components'));
  await mkdir(path.join(servicePath, 'Screens'));

  // Create files
  const files = [
    ['$name.module.js'],
    ['$name.navigation.js'],
    ['$name.service.js'],
    ['$name.connect.js'],
    ['$name.dto.js'],
    ['$name.hook.js'],
    ['$name.type.js'],

    ['Screens', 'Example.js'],
  ];

  const regLowerName = new RegExp('\\$name', 'g');
  const regUpperName = new RegExp('\\$Name', 'g');

  for (let i = 0, l = files.length; i < l; i++) {
    const src = path.join(libPath, ...files[i]);
    const dst = path.join(servicePath, ...(files[i].map(fn => fn.replace(regLowerName, name))));
    let file = await readFile(src, 'utf8');
    file = file
      .replace(regLowerName, name)
      .replace(regUpperName, Name);
    await writeFile(dst, file);
  }
}

module.exports = {
  createService,
};
