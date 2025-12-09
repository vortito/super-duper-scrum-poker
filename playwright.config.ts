import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
    testDir: 'tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { outputFolder: 'test-artifacts/report', open: 'never' }]],
    outputDir: 'test-artifacts/results',
    use: {
        trace: 'on',
        screenshot: 'on',
        baseURL: 'http://localhost:5174',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    globalSetup: './tests/global-setup.ts',
    globalTeardown: './tests/global-teardown.ts',

    webServer: {
        command: 'npm run dev -- --mode test --port 5174',
        port: 5174,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
