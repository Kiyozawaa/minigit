import path from 'node:path';
import fs from 'node:fs';

export default function initialize() {
  const initdir = path.join(process.cwd(), '.minigit');
  const dirs = ['objects', 'commits'];
  const head = "HEAD";
  const index = "index.json";
  
  if (fs.existsSync(path.join(initdir, head))) {
    console.log('Repository already initialized.');
    return;
  }
  
  try {
    if (!fs.existsSync(initdir)) fs.mkdirSync(initdir);
    
    for (const dir of dirs) {
      const dirpath = path.join(initdir, dir);
      if (!fs.existsSync(dirpath)) fs.mkdirSync(dirpath);
    }
    
    const headPath = path.join(initdir, head);
    const indexPath = path.join(initdir, index);
    if (!fs.existsSync(headPath)) fs.writeFileSync(headPath, '', 'utf-8');
    if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, '{}', 'utf-8');
    
    console.log(`Empty git initialized.\n${initdir}`);
  } catch (err) {
    console.log(err);
  }
}