import { When, Then } from './fixtures';
import { PokerTablePage } from '../pages/poker-table.page';

When('{string} votes with the card {string}', async ({ world }, playerName: string, cardValue: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).vote(cardValue);
});

When('{string} changes their vote to the card {string}', async ({ world }, playerName: string, cardValue: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).vote(cardValue);
});

Then('the selected card of {string} is {string}', async ({ world }, playerName: string, cardValue: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).expectSelectedCard(cardValue);
});

Then('the vote counter shows {string} for {string} and {string}', async ({ world }, count: string, name1: string, name2: string) => {
    await new PokerTablePage(world.getPlayer(name1)).expectVoteCounter(count);
    await new PokerTablePage(world.getPlayer(name2)).expectVoteCounter(count);
});
