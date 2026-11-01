import { Page, Locator, expect } from '@playwright/test';
import { ACCENTS } from '../../src/context/ThemeContext';
import type { AccentName } from '../../src/context/ThemeContext';

/** Convert a hex color like "#10b981" to the CSS computed-style format "rgb(16, 185, 129)". */
function accentRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

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

    /** The name of the player belonging to this page (read from the same localStorage key the app uses). */
    private async ownName(): Promise<string> {
        return this.page.evaluate(() => localStorage.getItem('scrum_poker_user_name') ?? '');
    }

    private votingCard(value: string): Locator {
        const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.page.getByRole('button', { name: new RegExp(`^${escaped}(\\s+${escaped})*$`) });
    }

    private avatar(playerName: string): Locator {
        const escaped = playerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.page.getByTestId(`avatar-${escaped}`);
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
        // Wait until THIS player's board card surface is visible on the table (their vote is in the snapshot).
        // The surface is the div that toggles opacity-0/opacity-100 and keeps its transition classes
        // (unlike the revealed number face, which also has rounded-lg shadow-xl but no transition-all).
        const name = await this.ownName();
        const surface = this.boardCard(name).locator('div.transition-all.duration-300.rounded-lg.shadow-xl');
        await expect(surface).toHaveClass(/opacity-100/, { timeout: 5000 });
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

    async expectBoardCardFacesCenter(playerName: string): Promise<void> {
        const card = this.boardCard(playerName);
        await expect(card).toBeVisible({ timeout: 5000 });
        const style = (await card.getAttribute('style')) ?? '';
        expect(style).toContain('rotate(360deg)');
    }

    async expectAverage(value: string): Promise<void> {
        await expect(this.averageValue).toHaveText(value, { timeout: 5000 });
    }

    async expectConsensus(value: string): Promise<void> {
        await expect(this.consensusValue).toHaveText(value, { timeout: 5000 });
    }

    async expectAvatarAccent(playerName: string, accent: AccentName): Promise<void> {
        const accentHex = ACCENTS[accent].accent;
        await expect(this.avatar(playerName)).toBeVisible({ timeout: 10000 });
        await expect
            .poll(() => this.page.evaluate((name) => {
                const el = document.querySelector(`[data-testid="avatar-${name}"]`) as HTMLElement | null;
                if (!el) {
                    return '';
                }
                const styles = getComputedStyle(el);
                return `${styles.backgroundColor}|${styles.color}`;
            }, playerName))
            .toBe(`${accentRgb(accentHex)}|rgb(255, 255, 255)`);
    }

    /** The back of a player's board card is rendered with the owner's accent gradient. */
    async expectCardBackInAccent(playerName: string, accent: AccentName): Promise<void> {
        const card = this.boardCard(playerName);
        await expect(card).toBeVisible({ timeout: 5000 });
        await expect
            .poll(() => this.page.evaluate((name) => {
                const card = document.querySelector(`[data-testid="board-card-${name}"]`) as HTMLElement | null;
                const back = card ? (card.querySelector('div.absolute') as HTMLElement | null) : null;
                return back ? getComputedStyle(back).backgroundImage : '';
            }, playerName))
            .toContain(accentRgb(ACCENTS[accent].accent));
    }

    /** The revealed number of a player's board card is colored with the owner's accent-deep. */
    async expectRevealedNumberInAccentDeep(playerName: string, accent: AccentName): Promise<void> {
        const card = this.boardCard(playerName);
        await expect(card).toBeVisible({ timeout: 5000 });
        await expect
            .poll(() => this.page.evaluate((name) => {
                const card = document.querySelector(`[data-testid="board-card-${name}"]`) as HTMLElement | null;
                const face = card ? (card.querySelector('div.absolute') as HTMLElement | null) : null;
                if (!face) {
                    return '';
                }
                return getComputedStyle(face).color;
            }, playerName))
            .toBe(accentRgb(ACCENTS[accent].deep));
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
