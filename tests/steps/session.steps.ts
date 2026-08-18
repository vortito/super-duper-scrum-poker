import { Given, When, Then, expect } from './fixtures';

Given('que un usuario entra a la pantalla de inicio', async ({ page }) => {
    await page.goto('/');
});

When('crea una sala con el nombre {string}', async ({ page, world }, name: string) => {
    await page.getByPlaceholder('Ej. Ana, Juan...').fill(name);
    const button = page.getByRole('button', { name: 'Comenzar Sesión' });
    await expect(button).toBeEnabled();
    await button.click();

    await expect(page.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
    const roomText = await page.getByText(/Sala:/i).textContent();
    world.sessionId = roomText?.split(':')[1]?.trim() || '';
    world.players[name] = { page, context: page.context() };
});

Then('ve el tablero de la sala con un identificador único', async ({ page, world }) => {
    expect(world.sessionId.length).toBeGreaterThan(0);
    await expect(page.getByText(new RegExp(`Sala:\\s*${world.sessionId}`, 'i'))).toBeVisible();
});

Then('{string} aparece en la lista de participantes', async ({ page }, name: string) => {
    await expect(page.getByText(name)).toBeVisible();
});

Given('que {string} ha creado una sala de estimación', async ({ world }, hostName: string) => {
    const page = await world.createPlayer(hostName);
    await page.goto('/');
    await page.getByPlaceholder('Ej. Ana, Juan...').fill(hostName);
    await page.getByRole('button', { name: 'Comenzar Sesión' }).click();

    await expect(page.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
    const roomText = await page.getByText(/Sala:/i).textContent();
    world.sessionId = roomText?.split(':')[1]?.trim() || '';
    expect(world.sessionId.length).toBeGreaterThan(0);
});

When('{string} accede mediante el enlace de invitación de la sala', async ({ world }, playerName: string) => {
    const page = await world.createPlayer(playerName);
    await page.goto(`/?session=${world.sessionId}`);
    const sessionInput = page.getByPlaceholder('Ej. X7Y2Z9');
    await expect(sessionInput).toBeVisible();
    await expect(sessionInput).toHaveValue(world.sessionId);
});

When('confirma su entrada con el nombre {string}', async ({ world }, playerName: string) => {
    const page = world.getPlayer(playerName);
    await page.getByPlaceholder('Ej. Ana, Juan...').fill(playerName);
    await page.getByRole('button', { name: 'Entrar a la Sala' }).click();
});

Then('{string} entra a la sala', async ({ world }, playerName: string) => {
    const page = world.getPlayer(playerName);
    await expect(page.getByText(/Sala:/i)).toBeVisible({ timeout: 15000 });
});

Then('{string} y {string} se ven mutuamente en la sala de estimación', async ({ world }, name1: string, name2: string) => {
    const page1 = world.getPlayer(name1);
    const page2 = world.getPlayer(name2);

    await expect(page1.getByText(name1)).toBeVisible();
    await expect(page1.getByText(name2)).toBeVisible();

    await expect(page2.getByText(name1)).toBeVisible();
    await expect(page2.getByText(name2)).toBeVisible();
});

Then('el botón de comenzar sesión está deshabilitado si el nombre está vacío', async ({ page }) => {
    const nameInput = page.getByPlaceholder('Ej. Ana, Juan...');
    await nameInput.fill('');
    const startButton = page.getByRole('button', { name: 'Comenzar Sesión' });
    await expect(startButton).toBeDisabled();
});
