import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { hasChanges } from './commit.js';

export default function checkout() {
  const commitId = process.argv[3];
  if (!commitId) {
    console.log(`No Commit ID provided.`);
    return;
  }
  
  const headPath = path.join(process.cwd(), '.minigit', 'HEAD');
  if (!fs.existsSync(headPath)) {
    console.log('Mygit not initialized. Please run `node mygit.js init` to initialize an empty repository.');
    return;
  }
  const head = fs.readFileSync(headPath, 'utf-8');
  if (commitId === head) {
    console.log('Already at the given commit id.');
    return;
  }
  
  const commitPath = path.join(process.cwd(), '.minigit', 'commits', commitId + '.json');
  if (!fs.existsSync(commitPath)) {
    console.log(`Cannot find any commit with that ID.`);
    return;
  }
  const headFiles = getHeadFiles(head);
  
  for (const [filename, hash] of Object.entries(headFiles)) {
    const currFilePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(currFilePath)) {
      console.log(`${filename} missing from the given commit.`);
      return;
    }
    const currFile = fs.readFileSync(currFilePath, 'utf-8');
    const currFileHash = createHash('sha256').update(currFile).digest('hex');
    if (currFileHash !== hash) {
      console.log('Current directory has unstaged files. Please stage them before checkout.');
      return;
    }
  }
  
  const indexPath = path.join(process.cwd(), '.minigit', 'index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  
  if (hasChanges(index, head)) {
    console.log('Current directory has unstaged files. Please stage them before checkout.');
    return;
  }

  const commit = JSON.parse(fs.readFileSync(commitPath, 'utf-8'));
  const commitFiles = commit.files;
  
  try {
    for (const [filename, hash] of Object.entries(headFiles)) {
      if (!(filename in commitFiles)) {
        if (!fs.existsSync(path.join(process.cwd(), filename))) continue;
        fs.unlinkSync(path.join(process.cwd(), filename));
      }
    }
    for (const [filename, hash] of Object.entries(commitFiles)) {
      const objectContent = getObject(hash);
      const objectPath = path.join(process.cwd(), filename);
      fs.mkdirSync(path.dirname(objectPath), { recursive: true });
      fs.writeFileSync(objectPath, objectContent);
    }
    fs.writeFileSync(headPath, commitId);
    fs.writeFileSync(indexPath, JSON.stringify(commitFiles, null, 2));
    console.log(`Checkout to ${commitId} successful.`);
  } catch (err) {
    console.log(err);
  }
}

function getObject(hash) {
  if (!hash) return;
  const filePath = path.join(process.cwd(), '.minigit', 'objects', hash);
  const file = fs.readFileSync(filePath, 'utf-8');
  return file;
}


function getHeadFiles(head) {
  if (!head) return;
  const commitPath = path.join(process.cwd(), '.minigit', 'commits', head + '.json');
  const commit = JSON.parse(fs.readFileSync(commitPath, 'utf-8'));
  return commit.files;
}
