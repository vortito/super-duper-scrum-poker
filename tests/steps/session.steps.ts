import { Given, When, Then, expect } from './fixtures';
import { createRoom, joinRoom } from './orchestration.steps';
import { WelcomePage } from '../pages/welcome.page';
import { PokerTablePage } from '../pages/poker-table.page';

Given('{string} visits the home screen', async ({ world }, playerName: string) => {
    await new WelcomePage(await world.createPlayer(playerName)).openHome();
});

When('{string} creates a room', async ({ world }, playerName: string) => {
    await createRoom(world, playerName);
});

Then('{string} sees the room identifier on the board', async ({ world }, playerName: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).expectRoomCode(world.sessionId);
});

Then('{string} appears in the participant list', async ({ world }, playerName: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).expectParticipant(playerName);
});

When('{string} opens the invitation link for that room', async ({ world }, playerName: string) => {
    await new WelcomePage(await world.createPlayer(playerName)).openInviteLink(world.sessionId);
});

Then('{string} sees the room code pre-filled in the join form', async ({ world }, playerName: string) => {
    await new WelcomePage(world.getPlayer(playerName)).expectRoomCodePrefilled(world.sessionId);
});

When('{string} joins the room via the invitation link with the name {string}', async ({ world }, playerName: string, name: string) => {
    await joinRoom(world, name, world.sessionId);
});

Then('{string} and {string} can see each other in the room', async ({ world }, name1: string, name2: string) => {
    await new PokerTablePage(world.getPlayer(name1)).expectParticipant(name2);
    await new PokerTablePage(world.getPlayer(name2)).expectParticipant(name1);
});

Then('{string} sees the start session button disabled', async ({ world }, playerName: string) => {
    await new WelcomePage(world.getPlayer(playerName)).expectSubmitDisabled();
});

When('{string} opens the invitation link for the room {string}', async ({ world }, playerName: string, roomId: string) => {
    await new WelcomePage(await world.createPlayer(playerName)).openInviteLink(roomId);
});

Then('{string} sees the room code {string} pre-filled in the join form', async ({ world }, playerName: string, roomId: string) => {
    await new WelcomePage(world.getPlayer(playerName)).expectRoomCodePrefilled(roomId);
});

Then('{string} sees an error that the room does not exist', async ({ world }, playerName: string) => {
    await new WelcomePage(world.getPlayer(playerName)).expectSessionNotFound();
});

When('{string} clicks the copy link button', async ({ world }, playerName: string) => {
    await new PokerTablePage(world.getPlayer(playerName)).copyLink();
});

Then('{string} clipboard contains the current room URL', async ({ world }, playerName: string) => {
    const table = new PokerTablePage(world.getPlayer(playerName));
    expect(await table.readClipboard()).toBe(table.getUrl());
});
