import { Page, Locator, expect } from '@playwright/test';
import { ACCENTS, SURFACE_PALETTES, INK_PALETTES } from '../../src/context/ThemeContext';
import type { AccentName, ThemeMode } from '../../src/context/ThemeContext';
import { SettingsMenuPage } from './settings-menu.page';

const MODE_LABELS: Record<ThemeMode, string> = { dark: 'Dark mode', light: 'Light mode' };

export class ThemeSelectorPage {
    constructor(private readonly page: Page) {}

    private readonly settings = new SettingsMenuPage(page);

    private swatch(name: AccentName): Locator {
        return this.page.getByRole('button', { name, exact: true });
    }

    private modeToggle(mode: ThemeMode): Locator {
        return this.page.getByRole('button', { name: MODE_LABELS[mode], exact: true });
    }

    private async activeAccent(): Promise<AccentName> {
        const accent = await this.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim());
        const entry = Object.entries(ACCENTS).find(([, vars]) => vars.accent === accent);
        if (!entry) {
            throw new Error(`Unknown accent applied: ${accent}`);
        }
        return entry[0] as AccentName;
    }

    async select(name: AccentName): Promise<void> {
        await this.settings.open();
        await this.swatch(name).click();
    }

    async setMode(mode: ThemeMode): Promise<void> {
        await this.settings.open();
        await this.modeToggle(mode).click();
    }

    async expectActive(name: AccentName): Promise<void> {
        await this.settings.open();
        await expect(this.swatch(name)).toHaveAttribute('aria-pressed', 'true');
    }

    async expectMode(mode: ThemeMode): Promise<void> {
        await this.settings.open();
        await expect(this.modeToggle(mode)).toHaveAttribute('aria-pressed', 'true');
        await this.expectPaletteApplied(mode, await this.activeAccent());
    }

    async expectInkScale(mode: ThemeMode): Promise<void> {
        const palette = INK_PALETTES[mode];
        for (const [shade, value] of Object.entries(palette)) {
            await expect
                .poll(() => this.page.evaluate((name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), `--color-ink-${shade}`))
                .toBe(value);
        }
    }

    async expectAccentApplied(name: AccentName): Promise<void> {
        await expect
            .poll(() => this.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()))
            .toBe(ACCENTS[name].accent);
    }

    async expectPaletteApplied(mode: ThemeMode, accent: AccentName): Promise<void> {
        const palette = SURFACE_PALETTES[mode];
        const expected: Record<string, string> = {
            '--color-app-bg': palette.bg,
            '--color-app-surface': palette.surface,
            '--color-app-text': palette.text,
            '--color-accent': ACCENTS[accent].accent,
        };

        for (const [property, value] of Object.entries(expected)) {
            await expect
                .poll(() => this.page.evaluate((name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), property))
                .toBe(value);
        }
    }
}
