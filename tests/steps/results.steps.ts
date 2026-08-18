import { Given, When, Then, expect } from './fixtures';

When('{string} pulsa en {string}', async ({ world }, playerName: string, buttonName: string) => {
    const page = world.getPlayer(playerName);
    await page.getByRole('button', { name: buttonName }).click();
});

Then('las cartas se revelan mostrando {string} y {string} en el tablero', async ({ world }, card1: string, card2: string) => {
    // Check on first player's page
    const page1 = Object.values(world.players)[0].page;
    await expect(page1.getByRole('main').getByText(card1, { exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page1.getByRole('main').getByText(card2, { exact: true })).toBeVisible({ timeout: 5000 });
});

Then('el promedio mostrado en pantalla es {string}', async ({ world }, averageValue: string) => {
    for (const player of Object.values(world.players)) {
        await expect(player.page.getByText('Promedio')).toBeVisible({ timeout: 5000 });
        await expect(player.page.getByText(averageValue)).toBeVisible({ timeout: 5000 });
    }
});

Then('se muestra el mensaje de consenso {string} con el valor acordado {string}', async ({ world }, consensusTitle: string, agreedValue: string) => {
    for (const player of Object.values(world.players)) {
        await expect(player.page.getByText(consensusTitle)).toBeVisible({ timeout: 5000 });
        await expect(player.page.locator('.text-2xl', { hasText: agreedValue })).toBeVisible({ timeout: 5000 });
    }
});

Given('una sala con votos revelados entre {string} y {string}', async ({ world }, hostName: string, guestName: string) => {
    // 1. Host creates room
    const hostPage = await world.createPlayer(hostName);
    await hostPage.goto('/');
    await hostPage.getByPlaceholder('Ej. Ana, Juan...').fill(hostName);
    await hostPage.getByRole('button', { name: 'Comenzar Sesión' }).click();

    await expect(hostPage.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
    const roomText = await hostPage.getByText(/Sala:/i).textContent();
    world.sessionId = roomText?.split(':')[1]?.trim() || '';

    // 2. Guest joins room
    const guestPage = await world.createPlayer(guestName);
    await guestPage.goto(`/?session=${world.sessionId}`);
    await guestPage.getByPlaceholder('Ej. Ana, Juan...').fill(guestName);
    await guestPage.getByRole('button', { name: 'Entrar a la Sala' }).click();

    await expect(hostPage.getByText(guestName)).toBeVisible({ timeout: 10000 });
    await expect(guestPage.getByText(hostName)).toBeVisible({ timeout: 10000 });

    // 3. Vote and reveal
    await hostPage.getByRole('button', { name: /^5(\s+5)*$/ }).click();
    await guestPage.getByRole('button', { name: /^8(\s+8)*$/ }).click();
    await expect(hostPage.getByText('2 / 2 votos')).toBeVisible({ timeout: 5000 });

    await hostPage.getByRole('button', { name: 'Revelar Cartas' }).click();
    await expect(hostPage.getByText('Promedio')).toBeVisible({ timeout: 5000 });
});

Then('las cartas del tablero se ocultan y los votos se reinician a {string}', async ({ world }, resetVoteCount: string) => {
    for (const player of Object.values(world.players)) {
        await expect(player.page.getByText(resetVoteCount)).toBeVisible({ timeout: 5000 });
        await expect(player.page.getByRole('button', { name: 'Revelar Cartas' })).toBeVisible({ timeout: 5000 });
    }
});
