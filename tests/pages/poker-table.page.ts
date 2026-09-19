import { Page, Locator, expect } from '@playwright/test';

export class PokerTablePage {
    readonly voteCounter: Locator;
    readonly revealButton: Locator;
    readonly newRoundButton: Locator;
    readonly copyLinkButton: Locator;
    readonly averageValue: Locator;
    readonly consensusValue: Locator;

    constructor(private readonly page: Page) {
        this.voteCounter = page.getByTestId('vote-count');
        this.revealButton = page.getByTestId('reveal-button');
        this.newRoundButton = page.getByTestId('new-round-button');
        this.copyLinkButton = page.getByTestId('copy-link-button');
        this.averageValue = page.getByTestId('average-value');
        this.consensusValue = page.getByTestId('consensus-value');
    }

    private roomCode(): Locator {
        return this.page.getByTestId('room-code');
    }

    private boardCard(playerName: string): Locator {
        return this.page.getByTestId(`board-card-${playerName}`);
    }

    private votingCard(value: string): Locator {
        const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.page.getByRole('button', { name: new RegExp(`^${escaped}(\\s+${escaped})*$`) });
    }

    async waitForEntry(): Promise<void> {
        await expect(this.roomCode()).toBeVisible({ timeout: 15000 });
    }

    async getRoomCode(): Promise<string> {
        return (await this.roomCode().textContent())?.trim() ?? '';
    }

    async expectRoomCode(roomId: string): Promise<void> {
        await expect(this.roomCode()).toHaveText(roomId);
        await expect(this.page).toHaveURL(new RegExp(`room/${roomId}$`));
    }

    async expectParticipant(playerName: string): Promise<void> {
        await expect(this.page.getByText(playerName)).toBeVisible({ timeout: 10000 });
    }

    async vote(value: string): Promise<void> {
        await this.votingCard(value).click();
    }

    async expectSelectedCard(value: string): Promise<void> {
        await expect(this.votingCard(value)).toHaveClass(/bg-white/);
    }

    async expectVoteCounter(count: string): Promise<void> {
        await expect(this.voteCounter).toContainText(count, { timeout: 5000 });
    }

    async reveal(): Promise<void> {
        await this.revealButton.click();
    }

    async startNewRound(): Promise<void> {
        await this.newRoundButton.click();
    }

    async expectBoardCard(playerName: string, value: string): Promise<void> {
        await expect(this.boardCard(playerName)).toBeVisible({ timeout: 5000 });
        await expect(this.boardCard(playerName)).toHaveText(value);
    }

    async expectBoardCardHidden(playerName: string): Promise<void> {
        await expect(this.boardCard(playerName)).toHaveText('');
    }

    async expectAverage(value: string): Promise<void> {
        await expect(this.averageValue).toHaveText(value, { timeout: 5000 });
    }

    async expectConsensus(value: string): Promise<void> {
        await expect(this.consensusValue).toHaveText(value, { timeout: 5000 });
    }

    async copyLink(): Promise<void> {
        await this.copyLinkButton.click();
    }

    async readClipboard(): Promise<string> {
        return this.page.evaluate(() => navigator.clipboard.readText());
    }

    getUrl(): string {
        return this.page.url();
    }
}
