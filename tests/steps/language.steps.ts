import { When, Then } from './fixtures';
import { LanguageSelectorPage } from '../pages/language-selector.page';
import { WelcomePage } from '../pages/welcome.page';
import type { Language } from '../../src/types';

const LOCALE_BY_NAME: Record<string, Language> = {
    English: 'en',
    French: 'fr',
    Spanish: 'es'
};

When('{string} selects the language {string}', async ({ world }, playerName: string, code: string) => {
    await new LanguageSelectorPage(world.getPlayer(playerName)).select(code);
});

Then('{string} sees the home screen displayed in {string}', async ({ world }, playerName: string, languageName: string) => {
    await new WelcomePage(world.getPlayer(playerName)).expectContentIn(LOCALE_BY_NAME[languageName]);
});
