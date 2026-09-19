/* eslint-disable react-hooks/rules-of-hooks -- Test fixtures call hooks outside a component to build the world; this is test scaffolding, not application code */
import { test as base, createBdd } from 'playwright-bdd';
import { expect, Page, Browser, BrowserContext } from '@playwright/test';

export class TestWorld {
    players: Record<string, { page: Page; context: BrowserContext }> = {};
    sessionId: string = '';
    private contexts: BrowserContext[] = [];

    constructor(private browser: Browser) {}

    async createPlayer(name: string): Promise<Page> {
        if (this.players[name]) {
            return this.players[name].page;
        }
        const context = await this.browser.newContext({
            permissions: ['clipboard-read', 'clipboard-write'],
        });
        this.contexts.push(context);
        const page = await context.newPage();
        this.players[name] = { page, context };
        return page;
    }

    getPlayer(name: string): Page {
        const player = this.players[name];
        if (!player) {
            throw new Error(`Player ${name} does not exist in the current session`);
        }
        return player.page;
    }

    async cleanup(): Promise<void> {
        await Promise.allSettled(this.contexts.map((ctx) => ctx.close()));
        this.players = {};
        this.contexts = [];
    }
}

export const test = base.extend<{ world: TestWorld }>({
    world: async ({ browser }, use) => {
        const world = new TestWorld(browser);
        await use(world);
        await world.cleanup();
    },
});

export const { Given, When, Then, Before, After } = createBdd(test);
export { expect };
