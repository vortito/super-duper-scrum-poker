import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PID_FILE = path.join(__dirname, '.emulator.pid');

async function globalTeardown() {
    console.log('Global Teardown: Stopping Emulators...');

    if (fs.existsSync(PID_FILE)) {
        const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);

        if (pid) {
            try {
                process.kill(pid, 'SIGKILL');
            } catch (e) {
                console.log('Could not kill process by PID (maybe already gone)', e);
            }
        }

        fs.unlinkSync(PID_FILE);
    }

    console.log('Global Teardown: Cleaning ports...');
    const cleanup = spawn('fuser', ['-k', '-v', '8080/tcp', '9099/tcp']);

    await new Promise((resolve) => {
        cleanup.on('close', resolve);
        setTimeout(resolve, 5000);
    });

    console.log('Global Teardown: Done');
}

export default globalTeardown;
