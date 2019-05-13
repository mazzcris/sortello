module.exports.accessFromChromeExtension = function () {


  browser.get('/app.html?extId=' + (process.env.TEST_TRELLO_EXTID || browser.params.testTrelloExtId));
  let EC = protractor.ExpectedConditions;
  let continueButton = element(by.css('.continue-to-choices--button'));
  browser.wait(EC.visibilityOf(continueButton), 2500).then(function () {
    let EC = protractor.ExpectedConditions;
    let continueButton = element(by.css('.continue-to-choices--button'));
    browser.wait(EC.visibilityOf(continueButton), 10000);
    browser.actions().mouseMove(continueButton).click().perform();
    browser.driver.sleep(1000);
    protractor.selectWindow.selectWindow(1, browser);
    EC = protractor.ExpectedConditions;

    let acceptButton = element(by.css('#surface form a.button.primary'));
    browser.wait(EC.presenceOf(acceptButton), 10000).then(function(){
      // browser.driver.manage().window().maximize(); // this is not working anymore
      element(by.css('#surface form a.button.primary')).click();
    });

    EC = protractor.ExpectedConditions;
    let submitButton = element(by.css('input#user'));
    browser.wait(EC.visibilityOf(submitButton), 10000);
    let loginButton = element(by.css('input#login'));
    element(by.css('input#user')).sendKeys(process.env.TEST_TRELLO_USERNAME || browser.params.testTrelloUsername);
    element(by.css('input#password')).sendKeys(process.env.TEST_TRELLO_PASSWORD || browser.params.testTrelloPassword);
    browser.actions().mouseMove(loginButton).click().perform().then(function () {
      let EC = protractor.ExpectedConditions;
      let approveButton = element(by.css("input.primary[name='approve']"));
      browser.wait(EC.visibilityOf(approveButton), 10000);
      browser.actions().mouseMove(approveButton).click().perform();
      protractor.selectWindow.selectWindow(0, browser);
    });
  }, function () {
    return;
  });
  return;
}