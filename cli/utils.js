const fs = require('fs');
const path = require('path');
const util = require('util');
const fx = require('mkdir-recursive');

const exists = util.promisify(fs.exists);

async function projectRoot() {
  let rootPath = process.cwd();
  const nmIndex = rootPath.indexOf('node_modules');
  if (nmIndex !== -1) {
    rootPath = rootPath.substring(0, nmIndex - 1);
  }
  const pathToPackageJson = path.join(rootPath, 'package.json');
  const res = await exists(pathToPackageJson);
  if (res) {
    return rootPath;
  }

  throw new Error('Root project folder is not defined!');
}







function createDirIfNotExists(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function updateScriptLists(fileInfo, listDir, scriptsDir, projectDir) {
  const list = readFile(listDir);

  if (copyFile(fileInfo.fullCopyPath, scriptsDir + fileInfo.relativePath)) {
    if (!list[fileInfo.libName]) {
      list[fileInfo.libName] = [];
    }

    const src = replaceProjectDirByPWD(scriptsDir + fileInfo.relativePath);
    const dst = replaceProjectDirByPWD(fileInfo.fullCopyPath);

    if (!list[fileInfo.libName].find(lib => (lib.src === src && lib.dst === dst))) {
      list[fileInfo.libName].push({ src, dst });
      writeFile(listDir, list);
    }
  }
}

function replaceProjectDirByPWD(dir, projectDir) {
  return dir.replace(projectDir, '{PWD}');
}

function replacePWDByProjectDir(dir, projectDir) {
  return dir.replace('{PWD}', projectDir);
}

function getFileInfo(arg) {
  const relativePath = path.relative('./node_modules', arg);
  const libName = relativePath.split(path.sep)[0];
  const fullCopyPath = path.resolve(arg);
  const parsed = path.parse(relativePath);
  return {
    relativePath,
    fullCopyPath,
    libName,
    fileName: parsed.name,
    dir: parsed.dir,
  };
}

function makeDirectoryTree(path) {
  console.log('Make directory tree: ' + path);
  fx.mkdirSync(path);
}

function readFile(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return {};
  }
}

function writeFile(path, data) {
  try {
    return fs.writeFileSync(path, JSON.stringify(data), 'utf8');
  } catch (e) {
    return {};
  }
}

function copyFile(src, dst) {
  console.log('COPY: ', src, '->', dst);
  try {
    fs.writeFileSync(dst, fs.readFileSync(src));
    console.log('OK');
    return true;
  } catch (e) {
    console.log('ERROR: ' + e.message);
    return false;
  }
}

module.exports = {
  projectRoot,
  createDirIfNotExists,
  updateScriptLists,
  getFileInfo,
  makeDirectoryTree,
  readFile,
  copyFile,
  replacePWDByProjectDir,

};
