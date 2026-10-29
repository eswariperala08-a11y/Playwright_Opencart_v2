import { Locator, Page } from '@playwright/test';

export class AccountPage {
    private readonly page: Page;

    // Locators
    private readonly accountMenu: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with live page labels
        this.accountMenu = page.getByTitle('My Account');
    }

    /**
     * Verifies that the authenticated account dashboard is displayed.
     * @returns Promise<boolean> - true when the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        const heading = this.page.locator('#content').getByRole('heading', { name: 'My Account', exact: true });
        await heading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Logs out using the My Account menu.
     */
    async logout(): Promise<void> {
        await this.accountMenu.click();
        await this.page.locator('#top-links').getByRole('link', { name: 'Logout', exact: true }).click();
    }

    /**
     * Verifies the logout confirmation page.
     * @returns Promise<boolean> - true when the Account Logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        return this.page.getByRole('heading', { name: 'Account Logout', exact: true }).isVisible();
    }

    /**
     * Continues to the homepage from the logout confirmation.
     */
    async continueAfterLogout(): Promise<void> {
        await this.page.getByRole('link', { name: 'Continue', exact: true }).click();
    }
}