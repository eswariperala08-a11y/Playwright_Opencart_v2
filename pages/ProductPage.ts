import { Locator, Page } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly quantityField: Locator;
    private readonly addToCartButton: Locator;
    private readonly addedMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with live page labels
        this.quantityField = page.getByRole('textbox', { name: 'Qty' });
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart', exact: true });
        this.addedMessage = page.getByText('Success: You have added', { exact: false });
    }

    /**
     * Verifies that the product details page is displayed.
     * @param productName - Expected product heading
     * @returns Promise<boolean> - true when the product heading is visible
     */
    async isProductPageExists(productName: string): Promise<boolean> {
        const heading = this.page.getByRole('heading', { name: productName, exact: true });
        await heading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Sets the requested product quantity.
     * @param quantity - Quantity to add
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.quantityField.fill(quantity);
    }

    /**
     * Adds the product to the shopping cart.
     */
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    /**
     * Verifies the product-added confirmation.
     * @returns Promise<boolean> - true when the success message is visible
     */
    async isAddedMessageVisible(): Promise<boolean> {
        await this.addedMessage.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Opens the shopping cart from the add-to-cart confirmation.
     */
    async openShoppingCart(): Promise<void> {
        await this.addedMessage.getByRole('link', { name: 'shopping cart', exact: true }).click();
    }
}