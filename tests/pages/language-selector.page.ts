import { Page } from '@playwright/test';
import { SettingsMenuPage } from './settings-menu.page';

export class LanguageSelectorPage {
    constructor(private readonly page: Page) {}

    private readonly settings = new SettingsMenuPage(page);

    async select(code: string): Promise<void> {
        await this.settings.open();
        await this.page.getByRole('button', { name: code, exact: true }).click();
    }
}
