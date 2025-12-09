import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PID_FILE = path.join(__dirname, '.emulator.pid');

async function globalSetup() {
    console.log('Global Setup: Starting Firebase Emulators...');

    if (fs.existsSync(PID_FILE)) {
        fs.unlinkSync(PID_FILE);
    }

    try {
        const clearPorts = spawn('fuser', ['-k', '8080/tcp', '9099/tcp']);
        await new Promise((resolve) => clearPorts.on('close', resolve));
    } catch {
        // ignore
    }

    const emulator = spawn('npx', ['firebase', 'emulators:start', '--project', 'test-project'], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
    });

    if (emulator.pid) {
        fs.writeFileSync(PID_FILE, emulator.pid.toString());
    }

    await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for emulators'));
        }, 60000);

        emulator.stdout.on('data', (data) => {
            const str = data.toString();
            console.log('[Emulator]', str);
            if (str.includes('All emulators ready')) {
                clearTimeout(timeout);
                resolve();
            }
        });

        emulator.stderr.on('data', (data) => {
            console.error('[Emulator Err]', data.toString());
        });

        emulator.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(`Emulator exited with code ${code}`));
            }
        });
    });

    console.log('Global Setup: Emulators Ready');
}

export default globalSetup;
