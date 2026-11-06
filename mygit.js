import initialize from './commands/init.js';
import add from './commands/add.js';
import commit from './commands/commit.js';
import log from './commands/log.js';
import checkout from './commands/checkout.js';
import status from './commands/status.js';

const command = process.argv[2];

switch(command) {
  case 'init':
    initialize();
    break;
  case 'add':
    add();
    break;
  case 'commit':
    commit();
    break;
  case 'log':
    log();
    break;
  case 'checkout':
    checkout();
    break;
  case 'status':
    status();
    break;
  default:
    console.log('No arguments provided.');
    break;
}