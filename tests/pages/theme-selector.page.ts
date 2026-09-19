import { Page, Locator, expect } from '@playwright/test';
import { THEMES } from '../../src/context/ThemeContext';
import type { ThemeName } from '../../src/context/ThemeContext';

export class ThemeSelectorPage {
    constructor(private readonly page: Page) {}

    private swatch(name: ThemeName): Locator {
        return this.page.getByRole('button', { name, exact: true });
    }

    async select(name: ThemeName): Promise<void> {
        await this.swatch(name).click();
    }

    async expectActive(name: ThemeName): Promise<void> {
        await expect(this.swatch(name)).toHaveAttribute('aria-pressed', 'true');
    }

    async expectAccentApplied(name: ThemeName): Promise<void> {
        await expect
            .poll(() => this.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()))
            .toBe(THEMES[name].accent);
    }
}
