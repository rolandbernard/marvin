
import { argv, exit } from 'process';

import { sendGlobalIpc } from 'main/global-ipc';

async function handleMessage() {
    try {
        const cmd = argv[argv.indexOf('msg') + 1];
        if (cmd === 'show' || cmd === 'toggle' || cmd === 'hide' || cmd === 'settings' || cmd === 'quit') {
            await sendGlobalIpc({ kind: cmd, args: argv.slice(argv.indexOf('msg') + 2) });
        } else {
            console.error('Unknown IPC message command.');
        }
    } catch (e) {
        console.error('Failed to send IPC message.');
    }
    exit(0);
}

handleMessage();

