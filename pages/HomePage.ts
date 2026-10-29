import { Locator, Page } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly accountMenu: Locator;
    private readonly searchField: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with live page labels
        this.accountMenu = page.getByTitle('My Account');
        this.searchField = page.getByRole('textbox', { name: 'Search' });
    }

    /**
     * Opens the My Account menu.
     */
    async clickMyAccount(): Promise<void> {
        await this.accountMenu.click();
    }

    /**
     * Opens the registration page from the My Account menu.
     */
    async clickRegister(): Promise<void> {
        await this.clickMyAccount();
        await this.page.getByRole('link', { name: 'Register', exact: true }).click();
    }

    /**
     * Opens the login page from the My Account menu.
     */
    async clickLogin(): Promise<void> {
        await this.clickMyAccount();
        await this.page.getByRole('link', { name: 'Login', exact: true }).click();
    }

    /**
     * Searches the product catalog.
     * @param productName - Product name to search for
     */
    async searchProduct(productName: string): Promise<void> {
        await this.searchField.fill(productName);
        await this.searchField.press('Enter');
    }

    /**
     * Opens the first matching product link from the current page.
     * @param productName - Product name to open
     */
    async openProduct(productName: string): Promise<void> {
        await this.page.getByRole('link', { name: productName, exact: true }).first().click();
    }

    /**
     * Checks whether a product appears in the current page results.
     * @param productName - Product name to find
     * @returns Promise<boolean> - true when the product heading is visible
     */
    async isProductVisible(productName: string): Promise<boolean> {
        const heading = this.page.getByRole('heading', { name: productName, exact: true });
        await heading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Checks whether the signed-in Logout option is available in the account menu.
     * @returns Promise<boolean> - true when Logout is visible
     */
    async isLogoutOptionVisible(): Promise<boolean> {
        await this.clickMyAccount();
        return this.page.locator('#top-links').getByRole('link', { name: 'Logout', exact: true }).isVisible();
    }
}