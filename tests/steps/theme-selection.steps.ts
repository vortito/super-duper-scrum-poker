import { Given, When, Then } from './fixtures';
import { ThemeSelectorPage } from '../pages/theme-selector.page';
import { WelcomePage } from '../pages/welcome.page';
import type { AccentName, ThemeMode } from '../../src/context/ThemeContext';

const MODES: Record<string, ThemeMode> = { light: 'light', dark: 'dark' };

Given('{string} has selected the theme {string}', async ({ world }, playerName: string, themeName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).select(themeName as AccentName);
});

When('{string} selects the theme {string}', async ({ world }, playerName: string, themeName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).select(themeName as AccentName);
});

Given('{string} has switched to the {string} mode', async ({ world }, playerName: string, modeName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).setMode(MODES[modeName]);
});

When('{string} switches to the {string} mode', async ({ world }, playerName: string, modeName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).setMode(MODES[modeName]);
});

When('{string} reloads the page', async ({ world }, playerName: string) => {
    await new WelcomePage(world.getPlayer(playerName)).reload();
});

Then('{string} sees the {string} theme active', async ({ world }, playerName: string, themeName: string) => {
    const themes = new ThemeSelectorPage(world.getPlayer(playerName));
    await themes.expectActive(themeName as AccentName);
    await themes.expectAccentApplied(themeName as AccentName);
});

Then('{string} sees the {string} mode active', async ({ world }, playerName: string, modeName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).expectMode(MODES[modeName]);
});

Then('{string} sees the {string} accent active', async ({ world }, playerName: string, accentName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).expectAccentApplied(accentName as AccentName);
});
