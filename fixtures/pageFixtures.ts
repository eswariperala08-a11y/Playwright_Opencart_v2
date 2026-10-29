import { test as base, BrowserContext, Page } from '@playwright/test';
import dotenv from 'dotenv';
import { AccountPage } from '../pages/AccountPage';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { RegisterPage } from '../pages/RegisterPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || 'https://awesomeqa.com/ui/';

type PageFixtures = {
    homePage: HomePage;
    accountPage: AccountPage;
    cartPage: CartPage;
    loginPage: LoginPage;
    productPage: ProductPage;
    registerPage: RegisterPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    accountPage: async ({ page }, use) => {
        await use(new AccountPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
});

test.afterEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    if (!page.isClosed()) {
        await page.close();
    }
    await context.close();
});

export { expect } from '@playwright/test';