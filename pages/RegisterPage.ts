import { Locator, Page } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly firstNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly emailField: Locator;
    private readonly telephoneField: Locator;
    private readonly passwordField: Locator;
    private readonly confirmPasswordField: Locator;
    private readonly privacyPolicyCheckbox: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with live page labels
        this.firstNameField = page.getByPlaceholder('First Name');
        this.lastNameField = page.getByPlaceholder('Last Name');
        this.emailField = page.getByPlaceholder('E-Mail');
        this.telephoneField = page.getByPlaceholder('Telephone');
        this.passwordField = page.getByPlaceholder('Password', { exact: true });
        this.confirmPasswordField = page.getByPlaceholder('Password Confirm');
        this.privacyPolicyCheckbox = page.getByRole('checkbox');
        this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    }

    /**
     * Verifies that the registration page is displayed.
     * @returns Promise<boolean> - true when the Register Account heading is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        const heading = this.page.getByRole('heading', { name: 'Register Account', exact: true });
        await heading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Completes and submits the registration form.
     * @param customer - Registration details
     */
    async register(customer: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        password: string;
    }): Promise<void> {
        await this.firstNameField.fill(customer.firstName);
        await this.lastNameField.fill(customer.lastName);
        await this.emailField.fill(customer.email);
        await this.telephoneField.fill(customer.telephone);
        await this.passwordField.fill(customer.password);
        await this.confirmPasswordField.fill(customer.password);
        await this.privacyPolicyCheckbox.check();
        await this.continueButton.click();
    }

    /**
     * Verifies that account creation succeeded.
     * @returns Promise<boolean> - true when the confirmation heading is visible
     */
    async isAccountCreated(): Promise<boolean> {
        const heading = this.page.getByRole('heading', { name: 'Your Account Has Been Created!', exact: true });
        await heading.waitFor({ state: 'visible' });
        return true;
    }
}