import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

const loginData = DataProvider.readJson('./testdata/opencart_logindata.json') as {
    testName: string;
    email: string;
    password: string;
    expected: string;
}[];

test.describe.serial('OpenCart data-driven customer login @datadriven @web', () => {
    loginData.forEach((row, index) => {
        test(`${row.testName} data row ${index + 1} @master @regression @datadriven @web`, async ({ homePage, loginPage, accountPage }) => {
            await test.step('1) Navigate to the login page', async () => {
                await homePage.clickLogin();
                expect(await loginPage.isLoginPageExists()).toBeTruthy();
            });

            await test.step('2) Submit the row credentials without substituting blank values', async () => {
                await loginPage.login(row.email, row.password);
            });

            await test.step('3) Verify the result for this data row', async () => {
                if (row.expected.toLowerCase() === 'success') {
                    expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
                } else {
                    expect(await loginPage.isLoginPageExists()).toBeTruthy();
                    expect(await loginPage.isWarningVisible()).toBeTruthy();
                }
            });
        });
    });
});