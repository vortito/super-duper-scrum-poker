import { spawnSync } from 'child_process';
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
        spawnSync('fuser', ['-k', '-v', ...ports.map((p) => `${p}/tcp`)]);
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

async function globalTeardown() {
    console.log('Global Teardown: Stopping Emulators...');

    if (fs.existsSync(PID_FILE)) {
        const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);

        if (pid) {
            try {
                process.kill(-pid, 'SIGKILL');
            } catch (err) {
                if ((err as NodeJS.ErrnoException).code === 'ESRCH') {
                    killProcess(pid);
                }
            }
        }

        fs.unlinkSync(PID_FILE);
    }

    console.log('Global Teardown: Cleaning ports...');
    clearPorts(EMULATOR_PORTS);

    console.log('Global Teardown: Done');
}

export default globalTeardown;
