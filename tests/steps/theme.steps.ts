import { When, Then, expect } from './fixtures';
import { Page, Locator } from '@playwright/test';

const ACCENT_COLORS: Record<string, string> = {
    blue: '#6366f1',
    green: '#10b981',
    pink: '#ec4899',
    orange: '#f97316',
    cyan: '#06b6d4',
};

const themeSwatch = (page: Page, name: string): Locator =>
    page.getByRole('button', { name, exact: true });

const readAccent = async (page: Page): Promise<string> =>
    page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim().toLowerCase()
    );

When('they select the theme {string}', async ({ page }, name: string) => {
    await themeSwatch(page, name).click();
});

When('the page is reloaded', async ({ page }) => {
    await page.reload();
});

Then('the active theme is {string}', async ({ page }, name: string) => {
    await expect(themeSwatch(page, name)).toHaveAttribute('aria-pressed', 'true');
});

Then('the accent color is the color of the {string} theme', async ({ page }, name: string) => {
    await expect.poll(() => readAccent(page)).toBe(ACCENT_COLORS[name]);
});
