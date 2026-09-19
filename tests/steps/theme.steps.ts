import { Given, When, Then } from './fixtures';
import { ThemeSelectorPage } from '../pages/theme-selector.page';
import { WelcomePage } from '../pages/welcome.page';
import type { ThemeName } from '../../src/context/ThemeContext';

Given('{string} has selected the theme {string}', async ({ world }, playerName: string, themeName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).select(themeName as ThemeName);
});

When('{string} selects the theme {string}', async ({ world }, playerName: string, themeName: string) => {
    await new ThemeSelectorPage(world.getPlayer(playerName)).select(themeName as ThemeName);
});

When('{string} reloads the page', async ({ world }, playerName: string) => {
    await new WelcomePage(world.getPlayer(playerName)).reload();
});

Then('{string} sees the {string} theme active', async ({ world }, playerName: string, themeName: string) => {
    const themes = new ThemeSelectorPage(world.getPlayer(playerName));
    await themes.expectActive(themeName as ThemeName);
    await themes.expectAccentApplied(themeName as ThemeName);
});
