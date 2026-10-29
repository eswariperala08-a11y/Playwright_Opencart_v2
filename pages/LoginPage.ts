import { Locator, Page } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;
    private readonly warningMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with live page labels
        this.emailField = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.passwordField = page.getByRole('textbox', { name: 'Password', exact: true });
        this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
        this.warningMessage = page.getByText(/Warning:/);
    }

    /**
     * Verifies that the customer login page is displayed.
     * @returns Promise<boolean> - true when the Account Login heading is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        const sectionHeading = this.page.getByRole('heading', { name: 'Returning Customer', exact: true });
        await sectionHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Submits the login form, leaving whitespace-only fields blank.
     * @param email - Customer email address
     * @param password - Customer password
     */
    async login(email: string, password: string): Promise<void> {
        if (email.trim()) {
            await this.emailField.fill(email);
        }
        if (password.trim()) {
            await this.passwordField.fill(password);
        }
        await this.loginButton.click();
    }

    /**
     * Verifies that an authentication warning is displayed.
     * @returns Promise<boolean> - true when a warning message is visible
     */
    async isWarningVisible(): Promise<boolean> {
        return this.warningMessage.isVisible();
    }

    /**
     * Provides the login warning locator for detailed assertions.
     * @returns Locator - Login warning message
     */
    getWarningMessage(): Locator {
        return this.warningMessage;
    }
}