# MiniGit
MiniGit is a lightweight, local version control system built from scratch using Node.js and its built-in modules. Inspired by Git, it provides basic version control functionality through a command-line interface.

## Features
- Initialize a local repository.
- Stage files and store their contents as hashed objects.
- Create commits with messages and parent references.
- View commit history.
- Checkout previous commits and restore project files.
- Check repository status to identify new, modified and deleted files.

## Limitations
- No branch support.
- Merging or collaboration is not possible.
- Does not support remote functions.
- Works synchronously. Not optimal for big projects.

## How to use
1. Clone the repository.
```bash
git clone <url>
```
2. Initialize an empty repository
```bash
node mygit.js init
```

## Commands

`init`
Initializes an empty repository.
```bash
node mygit.js init
```

`add`

Adds a specific file to the staging area. Use "." to stage all files.
```bash
node mygit.js add <filename>
node mygit.js add .
```

`commit`
Creates a snapshot of the currently staged files.
```bash
node mygit.js commit "Initial commit"
```

`status`
Displays new, modified, and deleted files.
```bash
node mygit.js status
```

`log`
Displays the commit history.
```bash
node mygit.js log
```

`checkout`
Switches to a specified commit and restores its snapshot.
```bash
node mygit.js checkout <commit-id>
```