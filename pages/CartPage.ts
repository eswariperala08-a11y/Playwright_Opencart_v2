import { Locator, Page } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with live page labels
        this.cartHeading = page.getByRole('heading', { name: /^Shopping Cart/ });
    }

    /**
     * Verifies that the shopping cart page is displayed.
     * @returns Promise<boolean> - true when the Shopping Cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        await this.cartHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Verifies that a product row is displayed in the cart.
     * @param productName - Product name to find
     * @returns Promise<boolean> - true when the product row is visible
     */
    async isProductVisible(productName: string): Promise<boolean> {
        const productRow = this.page.getByRole('row').filter({ hasText: productName }).last();
        await productRow.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Reads the quantity displayed for a product in the cart.
     * @param productName - Product name in the cart
     * @returns Promise<string> - Quantity shown in the product row
     */
    async getProductQuantity(productName: string): Promise<string> {
        return this.page.getByRole('row').filter({ hasText: productName }).last().getByRole('textbox').inputValue();
    }

    /**
     * Verifies the product's displayed unit and line total.
     * @param productName - Product name in the cart
     * @param price - Expected displayed price
     * @returns Promise<boolean> - true when the row contains the expected price
     */
    async isProductPriceVisible(productName: string, price: string): Promise<boolean> {
        const productPrice = this.page.getByRole('row').filter({ hasText: productName }).last().getByText(price, { exact: true }).first();
        await productPrice.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Verifies the cart grand total.
     * @param total - Expected cart total
     * @returns Promise<boolean> - true when the total row is visible
     */
    async isTotalVisible(total: string): Promise<boolean> {
        const totalRow = this.page.getByRole('row').filter({ hasText: `Total: ${total}` });
        await totalRow.waitFor({ state: 'visible' });
        return true;
    }
}