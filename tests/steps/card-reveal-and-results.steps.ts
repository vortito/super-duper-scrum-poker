import { When, Then } from './fixtures';
import { PokerTablePage } from '../pages/poker-table.page';

When('{string} reveals the cards', async ({ world }, playerName: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).reveal();
});

When('{string} starts a new round', async ({ world }, playerName: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).startNewRound();
});

Then('the board shows {string} voting {string} and {string} voting {string}', async ({ world }, name1: string, value1: string, name2: string, value2: string) => {
    const table = new PokerTablePage(world.getPlayer(name1));
    await table.expectBoardCard(name1, value1);
    await table.expectBoardCard(name2, value2);
});

Then('the average displayed is {string}', async ({ world }, value: string) => {
    for (const name of Object.keys(world.players)) {
        await new PokerTablePage(world.getPlayer(name)).expectAverage(value);
    }
});

Then('the consensus is shown with the agreed value {string}', async ({ world }, value: string) => {
    for (const name of Object.keys(world.players)) {
        await new PokerTablePage(world.getPlayer(name)).expectConsensus(value);
    }
});

Then('the cards of {string} and {string} are hidden on the table', async ({ world }, name1: string, name2: string) => {
    await new PokerTablePage(world.getPlayer(name1)).expectBoardCardHidden(name1);
    await new PokerTablePage(world.getPlayer(name2)).expectBoardCardHidden(name2);
});
