import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

let outDir = ''

const spa404Fallback: Plugin = {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
        outDir = config.build.outDir
    },
    closeBundle() {
        const indexHtml = join(outDir, 'index.html')
        if (existsSync(indexHtml)) {
            writeFileSync(join(outDir, '404.html'), readFileSync(indexHtml))
        }
    },
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), spa404Fallback],
    base: '/super-duper-scrum-poker/',
})
