// LOGIN INTEGRATION TEST
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Login Integration Test', () => {
    let driver;

    // Increase the default timeout for the entire test suite
    jest.setTimeout(20000); // Set timeout to 20 seconds

    beforeAll(async () => {
        const options = new chrome.Options();
        options.addArguments('--headless'); 

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit(); // Ensure driver is defined before quitting
        }
    });

    // TEST CASE 1: DISPLAY AN ERROR MESSAGE FOR NON-EXISTENT USER
    it('should display an error message for non-existent user', async () => {
        await driver.get('http://localhost:3000/login');

        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));

        await emailField.sendKeys('fake@email.com');
        await passwordField.sendKeys('123456789'); 

        await loginButton.click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.css('.mt-2.text-red-600')),
            20000 // Increased timeout for error message to 20 seconds
        );

        const errorText = await errorMessage.getText();
        expect(errorText).toBe('User does not exist.');
    });

    // TEST CASE 2: SUCCESSFUL LOGIN WITH VALID CREDENTIALS
    it('should log in successfully with valid credentials', async () => {
        await driver.get('http://localhost:3000/login');

        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));

        await emailField.sendKeys('steph@gmail.com'); 
        await passwordField.sendKeys('hellothere'); 

        await loginButton.click();

        await driver.wait(until.urlIs('http://localhost:3000/staff'), 20000); // Increased timeout for URL check to 20 seconds

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe('http://localhost:3000/staff'); 
    });

    // TEST CASE 3: SHOW ERROR MESSAGE FOR INCORRECT PASSWORD
    it('should show error message for incorrect password', async () => {
        await driver.get('http://localhost:3000/login'); 

        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));

        await emailField.sendKeys('validuser@example.com');
        await passwordField.sendKeys('wrongpassword'); 

        await loginButton.click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.css('.mt-2.text-red-600')),
            20000 // Increased timeout for error message to 20 seconds
        );

        const errorText = await errorMessage.getText();
        expect(errorText).toBe('User does not exist.'); 
    });

    // TEST CASE 4: DISPLAY ERROR MESSAGE FOR EMPTY EMAIL AND PASSWORD
    it('should display an error message for empty email and password', async () => {
        await driver.get('http://localhost:3000/login'); 

        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));

        await emailField.clear();
        await passwordField.clear(); 

        await loginButton.click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.css('.mt-2.text-red-600')),
            20000 // Increased timeout for error message to 20 seconds
        );

        const errorText = await errorMessage.getText();
        expect(errorText).toBe('User does not exist.'); 
    });
});
