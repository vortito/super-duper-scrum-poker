import { Given, When, Then, expect } from './fixtures';

Given('an active room with {string} and {string}', async ({ world }, hostName: string, guestName: string) => {
    // 1. Host creates room
    const hostPage = await world.createPlayer(hostName);
    await hostPage.goto('/');
    await hostPage.getByPlaceholder('Ej. Ana, Juan...').fill(hostName);
    await hostPage.getByRole('button', { name: 'Comenzar Sesión' }).click();

    await expect(hostPage.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
    const roomText = await hostPage.getByText(/Sala:/i).textContent();
    world.sessionId = roomText?.split(':')[1]?.trim() || '';
    expect(world.sessionId.length).toBeGreaterThan(0);

    // 2. Guest joins room
    const guestPage = await world.createPlayer(guestName);
    await guestPage.goto(`/?session=${world.sessionId}`);
    await guestPage.getByPlaceholder('Ej. Ana, Juan...').fill(guestName);
    await guestPage.getByRole('button', { name: 'Entrar a la Sala' }).click();

    // 3. Confirm both are connected
    await expect(hostPage.getByText(guestName)).toBeVisible({ timeout: 10000 });
    await expect(guestPage.getByText(hostName)).toBeVisible({ timeout: 10000 });
});

When('{string} votes card {string}', async ({ world }, playerName: string, cardValue: string) => {
    const page = world.getPlayer(playerName);
    const cardButton = page.getByRole('button', { name: new RegExp(`^${cardValue}(\\s+${cardValue})*$`) });
    await cardButton.click();
});

When('{string} changes their vote to card {string}', async ({ world }, playerName: string, cardValue: string) => {
    const page = world.getPlayer(playerName);
    const cardButton = page.getByRole('button', { name: new RegExp(`^${cardValue}(\\s+${cardValue})*$`) });
    await cardButton.click();
});

Then('the vote indicator shows {string} for both {string} and {string}', async ({ world }, countText: string, name1: string, name2: string) => {
    const page1 = world.getPlayer(name1);
    const page2 = world.getPlayer(name2);

    await expect(page1.getByText(countText)).toBeVisible({ timeout: 5000 });
    await expect(page2.getByText(countText)).toBeVisible({ timeout: 5000 });
});

Then('the card selected by {string} is {string}', async ({ world }, playerName: string, cardValue: string) => {
    const page = world.getPlayer(playerName);
    // When a card is selected in VotingCards, it has class 'bg-white border-indigo-500'
    const selectedCard = page.getByRole('button', { name: new RegExp(`^${cardValue}(\\s+${cardValue})*$`) });
    await expect(selectedCard).toHaveClass(/bg-white/);
});
