import { When, Then, expect } from './fixtures';

When('selecciona el idioma {string}', async ({ page }, langCode: string) => {
    const langButton = page.getByRole('button', { name: new RegExp(`^${langCode}$`, 'i'), exact: true });
    await langButton.click();
});

Then('el título y subtítulo se muestran en inglés', async ({ page }) => {
    await expect(page.getByText('Collaborative Agile Estimation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Session' })).toBeVisible();
});

Then('el título y subtítulo se muestran en francés', async ({ page }) => {
    await expect(page.getByText('Estimation Agile Collaborative')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Commencer la Session' })).toBeVisible();
});

Then('el título y subtítulo se muestran en español', async ({ page }) => {
    await expect(page.getByText('Estimación ágil colaborativa')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Comenzar Sesión' })).toBeVisible();
});
