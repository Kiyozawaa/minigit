import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { getAllFiles } from './../utils.js';

export default function add() {
  const filename = process.argv[3];
  if (!fs.existsSync(path.join(process.cwd(), '.minigit'))) {
    console.log('Minigit not initialized. Please run `node mygit.js init` to initialize.');
    return;
  }
  if (filename === '.') {
    addAll();
    return;
  }
  
  const filepath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filepath)) {
    console.log(`${filename} does not exist.`);
    return;
  }
  try {
    const contents = fs.readFileSync(filepath, 'utf-8');
    const hash = createHash('sha256').update(contents).digest('hex');
    const object = createObject(hash, contents);
    if (object) {
      updateIndex(filename, hash);
      console.log(`${filename} added to staging area.`);
    } else {
      console.log(`${filename} is already up to date in the staging area.`);
    }
  } catch (error) {
    console.log(error);
  }
}

function addAll() {
  const files = getAllFiles(path.join(process.cwd()));
  console.log(files)
  for (const file of files) {
    const filepath = path.join(process.cwd(), file);
    if (!fs.existsSync(filepath)) continue;
    const contents = fs.readFileSync(filepath, 'utf-8');
    const hash = createHash('sha256').update(contents).digest('hex');
    const object = createObject(hash, contents);
    updateIndex(file, hash);
  }
}

function createObject(hash, contents) {
  const filepath = path.join(process.cwd(), '.minigit', 'objects', hash);
  if (fs.existsSync(filepath)) return false;
  try {
    fs.writeFileSync(filepath, contents, 'utf-8');
    return true;
  } catch (error) {
    console.log(error);
  }
}

function updateIndex(filename, hash) {
  const indexPath = path.join(process.cwd(), '.minigit', 'index.json');
  try {
    const contents = fs.readFileSync(indexPath, 'utf-8');
    const json = JSON.parse(contents);
    json[filename] = hash;
    fs.writeFileSync(indexPath, JSON.stringify(json, null, 2));
  } catch (error) {
    console.log(error);
  }
}