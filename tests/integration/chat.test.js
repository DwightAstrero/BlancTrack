const { Builder, By, Key, until } = require('selenium-webdriver');

describe('Chat Integration Test', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    // TEST CASE 1: DISPLAY AN ERROR MESSAGE FOR NON-EXISTENT USER
    it('Should display a message to Steph Curry ', async () => {
        await driver.get('http://localhost:3000/staff');


    });

});
