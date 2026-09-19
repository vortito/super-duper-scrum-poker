import { Page } from '@playwright/test';

export class LanguageSelectorPage {
    constructor(private readonly page: Page) {}

    async select(code: string): Promise<void> {
        await this.page.getByRole('button', { name: code, exact: true }).click();
    }
}
