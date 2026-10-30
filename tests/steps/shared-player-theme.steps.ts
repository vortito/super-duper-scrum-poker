import { Then } from './fixtures';
import { PokerTablePage } from '../pages/poker-table.page';
import type { AccentName } from '../../src/context/ThemeContext';

Then('{word} sees {word} avatar in the {string} accent', async ({ world }, observer: string, target: string, accentName: string) => {
    await new PokerTablePage(world.getPlayer(observer)).expectAvatarAccent(target, accentName as AccentName);
});
