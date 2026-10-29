import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Customer registration succeeds @master @sanity @web', async ({ homePage, registerPage }) => {
    const generatedEmail = RandomDataUtil.getEmail();
    const customer = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: generatedEmail.replace('@', `.${Date.now()}@`),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(12),
    };

    await test.step('1) Navigate to the registration page', async () => {
        await homePage.clickRegister();
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
    });

    await test.step('2) Complete the registration form', async () => {
        await registerPage.register(customer);
        expect(await registerPage.isAccountCreated()).toBeTruthy();
    });

    await test.step('3) Verify the new account is available in account navigation', async () => {
        expect(await homePage.isLogoutOptionVisible()).toBeTruthy();
    });
});

test('Valid customer login succeeds @master @sanity @web', async ({ homePage, loginPage, accountPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('2) Sign in with configured customer credentials', async () => {
        await loginPage.login(email, password);
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });
});

test('Invalid customer login is rejected @master @regression @web', async ({ homePage, loginPage }) => {
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getPassword();

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('2) Submit invalid customer credentials', async () => {
        await loginPage.login(email, password);
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        expect(await loginPage.isWarningVisible()).toBeTruthy();
        await expect(loginPage.getWarningMessage()).toContainText('Warning: No match for E-Mail Address and/or Password.');
    });
});

test('Customer logout succeeds @master @sanity @web', async ({ homePage, loginPage, accountPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Sign in with configured customer credentials', async () => {
        await homePage.clickLogin();
        await loginPage.login(email, password);
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('2) Log out and verify the confirmation', async () => {
        await accountPage.logout();
        expect(await accountPage.isLogoutPageExists()).toBeTruthy();
    });

    await test.step('3) Continue to the homepage and verify signed-out navigation', async () => {
        await accountPage.continueAfterLogout();
        expect(await homePage.isLogoutOptionVisible()).toBeFalsy();
    });
});

test('Customer shopping journey completes end to end @master @regression @end-to-end @web', async ({ homePage, registerPage, loginPage, accountPage, productPage, cartPage }) => {
    const generatedEmail = RandomDataUtil.getEmail();
    const customer = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: generatedEmail.replace('@', `.${Date.now()}@`),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(12),
    };
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Register a new customer', async () => {
        await homePage.clickRegister();
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
        await registerPage.register(customer);
        expect(await registerPage.isAccountCreated()).toBeTruthy();
    });

    await test.step('2) Log out and sign in with the new account', async () => {
        await accountPage.logout();
        expect(await accountPage.isLogoutPageExists()).toBeTruthy();
        await accountPage.continueAfterLogout();
        await homePage.clickLogin();
        await loginPage.login(customer.email, customer.password);
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('3) Search for the product and open its details', async () => {
        await homePage.searchProduct(productName);
        expect(await homePage.isProductVisible(productName)).toBeTruthy();
        await homePage.openProduct(productName);
        expect(await productPage.isProductPageExists(productName)).toBeTruthy();
    });

    await test.step('4) Add the product and verify the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
        expect(await productPage.isAddedMessageVisible()).toBeTruthy();
        await productPage.openShoppingCart();
        expect(await cartPage.isCartPageExists()).toBeTruthy();
        expect(await cartPage.isProductVisible(productName)).toBeTruthy();
        expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
        expect(await cartPage.isProductPriceVisible(productName, totalPrice)).toBeTruthy();
        expect(await cartPage.isTotalVisible(totalPrice)).toBeTruthy();
    });
});