import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { getAllFiles } from './../utils.js';

export default function status() {
  const stagedFiles = getStagedFiles();
  const allFileHashes = getAllFileHashes();
  const newFiles = [];
  const changed = [];
  const unchanged = [];
  const deleted = [];
  
  for (const [file, hash] of Object.entries(allFileHashes)) {
    if (!Object.hasOwn(stagedFiles, file)) {
      newFiles.push(file);
    } else if (stagedFiles[file] !== hash) {
      changed.push(file);
    } else {
      unchanged.push(file);
    }
  }
  for (const [file, hash] of Object.entries(stagedFiles)) {
    if (!Object.hasOwn(allFileHashes, file)) {
      deleted.push(file);
    }
  }
  
  if (newFiles.length) {
    console.log('Untracked files:');
    for (const file of newFiles) {
      console.log('   ' + file);
    }
  }
  if (changed.length) {
    console.log();
    console.log('Modified files:');
    for (const file of changed) {
      console.log('   ' + file);
    }
  }
  
  if (deleted.length) {
    console.log();
    console.log('Deleted files');
    for (const file of deleted) {
      console.log('   ' + file);
    }
    console.log();
  }
}

function getStagedFiles() {
  const indexPath = path.join(process.cwd(), '.minigit', 'index.json');
  if (!fs.existsSync(indexPath)) return;
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  return index;
}

function getAllFileHashes() {
  const hashes = {};
  const files = getAllFiles(path.join(process.cwd()));
  for (const file of files) {
    const filepath = path.join(process.cwd(), file);
    if (!fs.existsSync(filepath)) continue;
    const contents = fs.readFileSync(filepath, 'utf-8');
    const hash = createHash('sha256').update(contents).digest('hex');
    hashes[file] = hash;
  }
  return hashes;
}