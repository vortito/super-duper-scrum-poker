import { Then } from './fixtures';
import { PokerTablePage } from '../pages/poker-table.page';
import type { AccentName } from '../../src/context/ThemeContext';

Then('{word} sees {word} avatar in the {string} accent', async ({ world }, observer: string, target: string, accentName: string) => {
    await new PokerTablePage(world.getPlayer(observer)).expectAvatarAccent(target, accentName as AccentName);
});

Then('the card of {string} is shown in the {string} accent', async ({ world }, playerName: string, accentName: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).expectCardBackInAccent(playerName, accentName as AccentName);
});

Then('the revealed card of {string} shows {string} in the {string} accent', async ({ world }, playerName: string, value: string, accentName: string) => {
    const table = new PokerTablePage(world.getPlayer(playerName));
    await table.expectBoardCard(playerName, value);
    await table.expectRevealedNumberInAccentDeep(playerName, accentName as AccentName);
});
