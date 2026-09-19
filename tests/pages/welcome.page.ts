import { Page, Locator, expect } from '@playwright/test';
import { translations } from '../../src/i18n/translations';
import type { Language } from '../../src/types';

const BASE_PATH = '/super-duper-scrum-poker/';

export class WelcomePage {
    readonly nameInput: Locator;
    readonly roomCodeInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly subtitle: Locator;

    constructor(private readonly page: Page) {
        this.nameInput = page.getByTestId('name-input');
        this.roomCodeInput = page.getByTestId('room-id-input');
        this.submitButton = page.getByTestId('submit-button');
        this.errorMessage = page.getByTestId('error-message');
        this.subtitle = page.getByTestId('welcome-subtitle');
    }

    async openHome(): Promise<void> {
        await this.page.goto('/');
    }

    async openInviteLink(roomId: string): Promise<void> {
        await this.page.goto(`${BASE_PATH}room/${roomId}`);
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.fill(name);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async reload(): Promise<void> {
        await this.page.reload();
    }

    async expectSubmitDisabled(): Promise<void> {
        await expect(this.submitButton).toBeDisabled();
    }

    async expectRoomCodePrefilled(roomId: string): Promise<void> {
        await expect(this.roomCodeInput).toBeVisible();
        await expect(this.roomCodeInput).toHaveValue(roomId);
    }

    async expectSessionNotFound(): Promise<void> {
        await expect(this.errorMessage).toBeVisible({ timeout: 15000 });
    }

    async expectContentIn(language: Language): Promise<void> {
        await expect(this.subtitle).toHaveText(translations[language].welcome.subtitle);
    }
}
