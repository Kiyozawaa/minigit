import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export default function commit() {
  const indexPath = path.join(process.cwd(), '.minigit', 'index.json');
  const headPath = path.join(process.cwd(), '.minigit', 'HEAD');
  if (!fs.existsSync(headPath) || !fs.existsSync(indexPath)) {
    console.log('Mygit not initialized. Please run `node mygit.js init` to start.');
    return;
  }
  
  const index = JSON.parse(
    fs.readFileSync(indexPath, 'utf-8')
    );
  const head = fs.readFileSync(headPath, 'utf-8');
  if (!hasChanges(index, head)) {
    console.log('Nothing to commit. Staging area is clean.');
    return;
  }
  
  const message = process.argv[3];
  if (!message) {
    console.log("Please provide a changelog message.");
    return;
  }
  const parent = head.length ? head : null;
  let commit = {
    message: message,
    parent: parent,
    files: {
      ...index
    }
  };
  const commitData = JSON.stringify(commit);
  const commitId = createHash('sha256').update(commitData).digest('hex');
  const commitFilePath = path.join(process.cwd(), '.minigit', 'commits', commitId + '.json');
  commit = {
    id: commitId,
    ...commit
  };
  fs.writeFileSync(commitFilePath, JSON.stringify(commit, null, 2));
  fs.writeFileSync(headPath, commitId);
  console.log(`Commit ${commitId} successful.`);
}

export function hasChanges(stagedFiles, head) {
  if (!head.length) return true;
  const commitPath = path.join(process.cwd(), '.minigit', 'commits', head + '.json');
  const commitContents = fs.readFileSync(commitPath, 'utf-8');
  const commit = JSON.parse(commitContents);
  const commitedFiles = commit.files;
  if (Object.keys(stagedFiles).length !== Object.keys(commitedFiles).length) return true;
  for (const [filename, hash] of Object.entries(stagedFiles)) {
    if (hash !== commitedFiles[filename]) return true;
  }
  return false;
}

