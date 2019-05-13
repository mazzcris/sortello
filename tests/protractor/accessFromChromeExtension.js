module.exports.accessFromChromeExtension = function (b = null, username = null, password = null) {
  return new Promise(function (resolve, reject) {
    if(b !== null){
      browser = b;
    }
    browser.ignoreSynchronization = true;
    browser.get('/app.html?extId=' + (process.env.TEST_TRELLO_EXTID || browser.params.testTrelloExtId)+"&fw=t");
    let EC = protractor.ExpectedConditions;
    let continueButton = browser.element(by.css('.continue-to-choices--button'));
    browser.wait(EC.visibilityOf(continueButton), 20000).then(function () {
      continueButton.click()
      browser.driver.sleep(500);
      protractor.selectWindow.selectWindow(1, browser);
      browser.driver.manage().window().setSize(800, 800);
      let acceptButton = browser.element(by.css('#surface form a.button.primary'));
      browser.wait(EC.presenceOf(acceptButton), 10000).then(function () {
        acceptButton.click();
        login(resolve, browser)
      });

    });
  });

  function login(resolve, browser){
    let EC = protractor.ExpectedConditions;
    let submitButton = browser.element(by.css('input#user'));
    browser.wait(EC.visibilityOf(submitButton), 10000);
    let loginButton = browser.element(by.css('input#login'));
    if(username !== null && password !== null){
      browser.element(by.css('input#user')).sendKeys(username);
      browser.element(by.css('input#password')).sendKeys(password);
    }else{
      browser.element(by.css('input#user')).sendKeys(process.env.TEST_TRELLO_USERNAME || browser.params.testTrelloUsername);
      browser.element(by.css('input#password')).sendKeys(process.env.TEST_TRELLO_PASSWORD || browser.params.testTrelloPassword);
    }
    browser.actions().mouseMove(loginButton).click().perform().then(function () {
      approve(resolve, browser);
    });
  }

  function approve(resolve, browser){
    let EC = protractor.ExpectedConditions;
    let approveButton = browser.element(by.css("input.primary[name='approve']"));
    browser.wait(EC.visibilityOf(approveButton), 10000).then(function () {
      browser.actions().mouseMove(approveButton).click().perform();
      protractor.selectWindow.selectWindow(0, browser);
      resolve("Logged in");
    });
  }

}