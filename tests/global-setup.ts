import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PID_FILE = path.join(__dirname, '.emulator.pid');
const EMULATOR_PORTS = ['8085', '9099', '4400', '4500', '9150'];

function killProcess(pid: number): void {
    try {
        process.kill(pid, 'SIGKILL');
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ESRCH') {
            throw err;
        }
    }
}

function clearPorts(ports: string[]): void {
    const fuserCheck = spawnSync('which', ['fuser']);
    if (fuserCheck.status === 0) {
        spawnSync('fuser', ['-k', ...ports.map((p) => `${p}/tcp`)]);
        return;
    }

    const lsofCheck = spawnSync('which', ['lsof']);
    if (lsofCheck.status === 0) {
        for (const port of ports) {
            const result = spawnSync('lsof', ['-ti', `tcp:${port}`]);
            const pids = result.stdout.toString().trim().split('\n').filter(Boolean);
            for (const pid of pids) {
                killProcess(parseInt(pid, 10));
            }
        }
    }
}

async function globalSetup() {
    console.log('Global Setup: Starting Firebase Emulators...');

    if (fs.existsSync(PID_FILE)) {
        fs.unlinkSync(PID_FILE);
    }

    clearPorts(EMULATOR_PORTS);

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
