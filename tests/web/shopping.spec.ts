import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search returns MacBook @master @sanity @web', async ({ homePage }) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Search for the known product', async () => {
        await homePage.searchProduct(productName);
        expect(await homePage.isProductVisible(productName)).toBeTruthy();
    });
});

test('Product can be added to the cart @master @sanity @web', async ({ homePage, productPage, cartPage }) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Search for the product and open its details', async () => {
        await homePage.searchProduct(productName);
        expect(await homePage.isProductVisible(productName)).toBeTruthy();
        await homePage.openProduct(productName);
        expect(await productPage.isProductPageExists(productName)).toBeTruthy();
    });

    await test.step('2) Add the requested quantity to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
        expect(await productPage.isAddedMessageVisible()).toBeTruthy();
        await productPage.openShoppingCart();
    });

    await test.step('3) Verify product and quantity in the cart', async () => {
        expect(await cartPage.isCartPageExists()).toBeTruthy();
        expect(await cartPage.isProductVisible(productName)).toBeTruthy();
        expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
    });
});