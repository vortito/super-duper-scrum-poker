import { Page, Locator, expect } from '@playwright/test';

export class SettingsMenuPage {
    readonly trigger: Locator;
    readonly panel: Locator;

    constructor(private readonly page: Page) {
        this.trigger = page.getByTestId('settings-menu');
        this.panel = page.getByTestId('settings-menu-panel');
    }

    async isOpen(): Promise<boolean> {
        return this.panel.isVisible().catch(() => false);
    }

    async open(): Promise<void> {
        if (await this.isOpen()) {
            return;
        }
        await this.trigger.click();
        await expect(this.panel).toBeVisible();
    }

    async close(): Promise<void> {
        if (!(await this.isOpen())) {
            return;
        }
        await this.page.keyboard.press('Escape');
        await expect(this.panel).toBeHidden();
    }

    async expectOpen(): Promise<void> {
        await expect(this.panel).toBeVisible();
        await expect(this.trigger).toHaveAttribute('aria-expanded', 'true');
    }

    async expectClosed(): Promise<void> {
        await expect(this.panel).toBeHidden();
        await expect(this.trigger).toHaveAttribute('aria-expanded', 'false');
    }
}
