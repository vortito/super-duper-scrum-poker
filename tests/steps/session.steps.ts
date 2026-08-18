import { Given, When, Then, expect } from './fixtures';

Given('a user visits the home screen', async ({ page }) => {
    await page.goto('/');
});

When('they create a room with the name {string}', async ({ page, world }, name: string) => {
    await page.getByPlaceholder('Ej. Ana, Juan...').fill(name);
    const button = page.getByRole('button', { name: 'Comenzar Sesión' });
    await expect(button).toBeEnabled();
    await button.click();

    await expect(page.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
    const roomText = await page.getByText(/Sala:/i).textContent();
    world.sessionId = roomText?.split(':')[1]?.trim() || '';
    world.players[name] = { page, context: page.context() };
});

Then('they see the room board with a unique identifier', async ({ page, world }) => {
    expect(world.sessionId.length).toBeGreaterThan(0);
    await expect(page.getByText(new RegExp(`Sala:\\s*${world.sessionId}`, 'i'))).toBeVisible();
});

Then('{string} appears in the participant list', async ({ page }, name: string) => {
    await expect(page.getByText(name)).toBeVisible();
});

Given('{string} has created an estimation room', async ({ world }, hostName: string) => {
    const page = await world.createPlayer(hostName);
    await page.goto('/');
    await page.getByPlaceholder('Ej. Ana, Juan...').fill(hostName);
    await page.getByRole('button', { name: 'Comenzar Sesión' }).click();

    await expect(page.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
    const roomText = await page.getByText(/Sala:/i).textContent();
    world.sessionId = roomText?.split(':')[1]?.trim() || '';
    expect(world.sessionId.length).toBeGreaterThan(0);
});

When('{string} accesses the room via the invitation link', async ({ world }, playerName: string) => {
    const page = await world.createPlayer(playerName);
    await page.goto(`/?session=${world.sessionId}`);
    const sessionInput = page.getByPlaceholder('Ej. X7Y2Z9');
    await expect(sessionInput).toBeVisible();
    await expect(sessionInput).toHaveValue(world.sessionId);
});

When('confirms their entry with the name {string}', async ({ world }, playerName: string) => {
    const page = world.getPlayer(playerName);
    await page.getByPlaceholder('Ej. Ana, Juan...').fill(playerName);
    await page.getByRole('button', { name: 'Entrar a la Sala' }).click();
});

Then('{string} enters the room', async ({ world }, playerName: string) => {
    const page = world.getPlayer(playerName);
    await expect(page.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
});

Then('{string} and {string} can see each other in the estimation room', async ({ world }, name1: string, name2: string) => {
    const page1 = world.getPlayer(name1);
    const page2 = world.getPlayer(name2);

    await expect(page1.getByText(name1)).toBeVisible();
    await expect(page1.getByText(name2)).toBeVisible();

    await expect(page2.getByText(name1)).toBeVisible();
    await expect(page2.getByText(name2)).toBeVisible();
});

Then('the start session button is disabled when the name is empty', async ({ page }) => {
    const nameInput = page.getByPlaceholder('Ej. Ana, Juan...');
    await nameInput.fill('');
    const startButton = page.getByRole('button', { name: 'Comenzar Sesión' });
    await expect(startButton).toBeDisabled();
});
