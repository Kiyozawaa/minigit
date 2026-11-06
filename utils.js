import fs from 'node:fs';
import path from 'node:path';

export function getAllFiles(dir, files = []) {
  const ignoreList = ['.minigit', 'commands', 'mygit.js', 'utils.js', 'package.json', 'readme.md'];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreList.includes(entry.name)) continue;
    const fullpath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullpath, files)
    } else {
      const relativepath = path.relative(process.cwd(), fullpath);
      files.push(relativepath);
    }
  }
  return files;
}