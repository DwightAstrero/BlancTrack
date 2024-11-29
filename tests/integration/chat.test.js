const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Notifications Integration Tests', () => {
    let driver;

    // Increase the default timeout for the entire test suite
    jest.setTimeout(100000);

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

    
    // TEST CASE 1: Responsive search bar
    it('User should be able to see filtered users when typing on the search bar', async () => {
        await driver.get('http://localhost:3000/login');

        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        

        await emailField.sendKeys('jaylen@gmail.com');
        await passwordField.sendKeys('hellothere'); 

        await loginButton.click();

        await driver.wait(until.urlIs('http://localhost:3000/staff'), 20000);

        const xbutton = await driver.wait(
            until.elementLocated(By.css("button.text-white.font-bold.text-xl")),
            5000 // Timeout in milliseconds
        );
        await xbutton.click();

        const chatButton = await driver.findElement(By.css(".fixed.bottom-4.right-4.p-3.bg-blue-500.text-white.rounded-full"));
        await chatButton.click();

        const searchInput = await driver.wait(
            until.elementIsVisible(driver.findElement(By.xpath("//input[@placeholder='Search users...']"))),
            5000 // Timeout in milliseconds
        );
        await searchInput.sendKeys('J');

    }); 

    //TEST CASE 2: If the recipient name is correct
    it('User should be able to see filtered users when typing on the search bar', async () => {
        await driver.get('http://localhost:3000/login');

        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        

        await emailField.sendKeys('steph@gmail.com');
        await passwordField.sendKeys('hellothere'); 

        await loginButton.click();

        await driver.wait(until.urlIs('http://localhost:3000/staff'), 20000);

        const xbuttons = await driver.wait(
            until.elementsLocated(By.css("button.text-white.font-bold.text-xl")),
            5000 // Timeout in milliseconds
        );
        await xbuttons[0].click();
        await xbuttons[1].click();

        await driver.sleep(1000);

        const chatButton = await driver.findElement(By.css(".fixed.bottom-4.right-4.p-3.bg-blue-500.text-white.rounded-full"));
        await chatButton.click();

        await driver.sleep(2000);

        const liElement = await driver.wait(
            until.elementLocated(By.css("li.cursor-pointer")),
            5000 // Timeout in milliseconds (5 seconds)
        );
          
          // Click on the <li> element
        await liElement.click();

    }); 

});
