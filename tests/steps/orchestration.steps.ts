import { Given, expect } from './fixtures';
import type { TestWorld } from './fixtures';
import { WelcomePage } from '../pages/welcome.page';
import { PokerTablePage } from '../pages/poker-table.page';

export async function createRoom(world: TestWorld, hostName: string): Promise<void> {
    const home = new WelcomePage(await world.createPlayer(hostName));
    await home.openHome();
    await home.fillName(hostName);
    await home.submit();

    const table = new PokerTablePage(world.getPlayer(hostName));
    await table.waitForEntry();
    world.sessionId = await table.getRoomCode();
    expect(world.sessionId.length).toBeGreaterThan(0);
}

export async function joinRoom(world: TestWorld, playerName: string, sessionId: string): Promise<void> {
    const home = new WelcomePage(await world.createPlayer(playerName));
    await home.openInviteLink(sessionId);
    await home.fillName(playerName);
    await home.submit();
    await new PokerTablePage(world.getPlayer(playerName)).waitForEntry();
}

export async function establishRoom(world: TestWorld, hostName: string, guestName: string): Promise<void> {
    await createRoom(world, hostName);
    await joinRoom(world, guestName, world.sessionId);
    await new PokerTablePage(world.getPlayer(hostName)).expectParticipant(guestName);
    await new PokerTablePage(world.getPlayer(guestName)).expectParticipant(hostName);
}

Given('{string} has created an estimation room', async ({ world }, hostName: string) => {
    await createRoom(world, hostName);
});

Given('an active room with {string} and {string}', async ({ world }, hostName: string, guestName: string) => {
    await establishRoom(world, hostName, guestName);
});

Given('{string} has voted with the card {string}', async ({ world }, playerName: string, cardValue: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).vote(cardValue);
});

Given('{string} has revealed the cards', async ({ world }, playerName: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).reveal();
});
