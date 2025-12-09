import { test, expect } from '@playwright/test';

test('create and join a session', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.goto('/');

    await page.getByPlaceholder('Ej. Ana, Juan...').fill('Alice');

    const button = page.getByRole('button', { name: 'Comenzar Sesión' });
    await expect(button).toBeEnabled();
    await button.click();

    await expect(page.locator('.animate-spin')).toBeVisible({ timeout: 2000 });
    console.log('Loading spinner visible');

    await expect(page.locator('.animate-spin')).toBeHidden({ timeout: 15000 });
    console.log('Loading spinner hidden');

    await expect(page.getByText(/Sala:/i)).toBeVisible();
    await expect(page.getByText('Alice')).toBeVisible();

    const roomText = await page.getByText(/Sala:/i).textContent();
    const sessionId = roomText?.split(':')[1].trim();
    console.log('Session ID:', sessionId);
    if (!sessionId) throw new Error('Could not find session ID');

    const browser = page.context().browser();
    if (!browser) throw new Error('No browser');

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    const joinUrl = `/?session=${sessionId}`;
    await page2.goto(joinUrl);

    const sessionInput = page2.getByPlaceholder('Ej. X7Y2Z9');
    await expect(sessionInput).toBeVisible();
    await expect(sessionInput).toHaveValue(sessionId);

    await page2.getByPlaceholder('Ej. Ana, Juan...').fill('Bob');
    await page2.getByRole('button', { name: 'Entrar a la Sala' }).click();

    await expect(page2.getByText('Alice')).toBeVisible();
    await expect(page2.getByText('Bob')).toBeVisible();

    await expect(page.getByText('Bob')).toBeVisible();

    await page.getByRole('button').filter({ hasText: '5' }).click();

    await page2.getByRole('button').filter({ hasText: '8' }).click();

    // Verify both players see that everyone has voted (sync check)
    await expect(page.getByText('2 / 2 votos')).toBeVisible({ timeout: 5000 });
    await expect(page2.getByText('2 / 2 votos')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'Revelar Cartas' }).click();

    await expect(page.getByRole('main').getByText('5', { exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('main').getByText('8', { exact: true })).toBeVisible();

    await expect(page2.getByText('Promedio')).toBeVisible();
    await expect(page2.getByText('6.5')).toBeVisible();

    await context2.close();
});
