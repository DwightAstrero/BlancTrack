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

    // TEST CASE 1: Receive notification when a task is created and assigned
    it('Employee should receive a notifications when a manager creates a new task', async () => {
        await driver.get('http://localhost:3000/login');

        const emailField = await driver.findElement(By.id('email'));
        const passwordField = await driver.findElement(By.id('password'));
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));

        await emailField.sendKeys('tyrese@gmail.com');
        await passwordField.sendKeys('hellothere'); 

        await loginButton.click();

        await driver.wait(until.urlIs('http://localhost:3000/manager'));

        const xbutton = await driver.wait(
            until.elementLocated(By.css("button.text-white.font-bold.text-xl")),
            5000 // Timeout in milliseconds
        );
        await xbutton.click();

        const createTaskButton = await driver.findElement(By.xpath("//h2[text()='+Add']"));
        await createTaskButton.click();

        await driver.wait(until.urlIs('http://localhost:3000/manager/create-task'), 20000);

        const titleField = await driver.findElement(By.id('title'));
        const descriptionField = await driver.findElement(By.id('description'));
        const statusField = await driver.findElement(By.id('status'));
        const dateField = await driver.findElement(By.id('dueDate'));
        const priorityField = await driver.findElement(By.id('priority'));
        const employeeField = await driver.findElement(By.id('staff'));

        await titleField.sendKeys('Project Update');
        await descriptionField.sendKeys('Hello please do this task'); 

        await statusField.click();
        const statusdropdownMenu = await driver.wait(until.elementLocated(By.css('.css-1nmdiq5-menu')));
        const statusOption = await statusdropdownMenu.findElement(By.xpath("//div[text()='In Progress']"));
        await statusOption.click();

        await dateField.click();
        const dateDropdown = await driver.wait(until.elementLocated(By.css('.react-datepicker__tab-loop')));
        const dateOption = await driver.wait(
            until.elementLocated(By.xpath("//div[@class='react-datepicker__day react-datepicker__day--015']")),
            10000
        );
        await dateOption.click();

        priorityField.click();
        const priorityDropdown = await driver.wait(until.elementLocated(By.css('.css-1nmdiq5-menu')));
        const priorityOption = await priorityDropdown.findElement(By.xpath("//div[text()='Low']"));
        await priorityOption.click();

        employeeField.click();
        const employeeDropdown = await driver.wait(until.elementLocated(By.css('.css-1nmdiq5-menu')));
        const employeeOption = await employeeDropdown.findElement(By.xpath("//div[text()='Steph Curry']"));
        await employeeOption.click();

        const submitTaskButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitTaskButton.click();

        await driver.wait(until.urlIs('http://localhost:3000/manager'), 20000);

        await driver.get('http://localhost:3000/login');

        staffemailField = await driver.findElement(By.id('email'));
        staffpasswordField = await driver.findElement(By.id('password'));
        loginButton2 = await driver.findElement(By.css('button[type="submit"]'));

        await staffemailField.sendKeys('steph@gmail.com'); 
        await staffpasswordField.sendKeys('hellothere'); 

        await loginButton2.click();

        await driver.wait(until.urlIs('http://localhost:3000/staff'), 20000); // Increased timeout for URL check to 20 seconds

        const currentUrl2 = await driver.getCurrentUrl();
        expect(currentUrl2).toBe('http://localhost:3000/staff'); 


    });

});
