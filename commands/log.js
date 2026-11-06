import fs from 'node:fs';
import path from 'node:path';

export default function log() {
  const headPath = path.join(process.cwd(), '.minigit', 'HEAD');
  if (!fs.existsSync(headPath)) {
    console.log('No commits to show.');
    return;
  }
  
  const head = fs.readFileSync(headPath, 'utf-8');
  if (!head.length) {
    console.log('No commits to show.');
    return;
  }
  const logs = getLogs(head);
  for (const log of logs) {
    console.log(`commit ${log.id}`);
    console.log(`       ${log.message}`);
    console.log();
  }
}

function getLogs(head) {
  const logs = [];
  if (!head) return logs;
  let tempHead = head;
  while (true) {
    const commitPath = path.join(process.cwd(), '.minigit', 'commits', tempHead + '.json');
    if (!fs.existsSync(commitPath)) break;
    const commit = JSON.parse(fs.readFileSync(commitPath, 'utf-8'));
    logs.push({
      id: commit.id,
      message: commit.message
      });
    if (commit.parent === null) break;
    tempHead = commit.parent;
  }
  return logs;
}