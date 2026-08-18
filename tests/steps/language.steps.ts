import { When, Then, expect } from './fixtures';

When('they select the language {string}', async ({ page }, langCode: string) => {
    const langButton = page.getByRole('button', { name: new RegExp(`^${langCode}$`, 'i'), exact: true });
    await langButton.click();
});

Then('the title and subtitle are shown in English', async ({ page }) => {
    await expect(page.getByText('Collaborative Agile Estimation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Session' })).toBeVisible();
});

Then('the title and subtitle are shown in French', async ({ page }) => {
    await expect(page.getByText('Estimation Agile Collaborative')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Commencer la Session' })).toBeVisible();
});

Then('the title and subtitle are shown in Spanish', async ({ page }) => {
    await expect(page.getByText('Estimación ágil colaborativa')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Comenzar Sesión' })).toBeVisible();
});
