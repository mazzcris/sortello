describe('cannot vote if cannot access to board', function () {
  var originalTimeout;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('cannot vote if does not have access to board', function (done) {

    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(840, 1032);
    browser.driver.manage().window().setPosition(0, 0);
    browser.driver.manage().window().toolbar = 0;
    browser.driver.manage().window().menubar = 0;

    let browser1 = browser

    let browser2 = browser.forkNewDriverInstance();
    browser2.ignoreSynchronization = true;
    browser2.driver.manage().window().setSize(840, 524);
    browser2.driver.manage().window().setPosition(840, 0);


    protractor.accessFromChromeExtension.accessFromChromeExtension(browser1).then(function () {
      protractor.accessFromChromeExtension.accessFromChromeExtension(browser2, browser.params.testTrello2Username, browser1.params.testTrello2Password).then(function () {
        let EC = protractor.ExpectedConditions;
        browser1.get('/app.html?extId=' + browser.params.testTrelloPrivateBoardExtId);
          let newRoomButton = element(by.css('#new-room-button'))
          browser1.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
            newRoomButton.click();
            let roomLinkElement = element(by.css('#room-link'))
            browser1.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
              roomLinkElement.getAttribute('value').then(function (link) {
                link = link.replace(browser.params.hostname + "/app.html", browser.params.hostname + ":4000/app.html")
                browser2.get(link)

                browser2.wait(EC.presenceOf(element(by.id('container_div'))), 20000).then(function () {
                  browser.sleep(2000);
                  expect(browser2.element(by.id('container_div')).getText()).toMatch(/.*You have no access to this board.*/)
                  browser2.element.all(by.id("second_div")).count().then(function (count) {
                    expect(count).toEqual(0)
                    browser2.close()
                    browser1.close()
                    done()
                  })
                })
              })
            })
          })
      });
    });
 });
});
