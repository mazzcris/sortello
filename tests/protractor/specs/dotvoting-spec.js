describe('dotvoting', function () {
  let originalTimeout;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('prioritizes a list in ascending order with 1 host and 2 guests', function (done) {

    browser.ignoreSynchronization = true;

    let browser1 = browser;
    let browser2 = browser.forkNewDriverInstance();
    let browser3 = browser.forkNewDriverInstance();

    browser1.driver.manage().window().setSize(840, 1032);
    browser1.driver.manage().window().setPosition(0, 0);
    // browser1.driver.manage().window().toolbar = 0;
    // browser1.driver.manage().window().menubar = 0;

    browser2.ignoreSynchronization = true;
    browser2.driver.manage().window().setSize(840, 524);
    browser2.driver.manage().window().setPosition(840, 0);

    browser3.ignoreSynchronization = true;
    browser3.driver.manage().window().setSize(840, 524);
    browser3.driver.manage().window().setPosition(840, 524);

    let browsersPriorities = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      ['10', '1', '2', '9', '3', '4', '8', '5', '7', '6'],
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    ];

    let EC = protractor.ExpectedConditions;
    let allLabels = element.all(by.tagName('option')).get(1);
    let buttonStart = element(by.css('.button__start-prioritizing'));



    return protractor.accessFromChromeExtension.accessFromChromeExtension(browser1).then(function () {
      protractor.accessFromChromeExtension.accessFromChromeExtension(browser2, browser1.params.testTrello2Username, browser1.params.testTrello2Password).then(function () {
        protractor.accessFromChromeExtension.accessFromChromeExtension(browser3, browser1.params.testTrello3Username, browser1.params.testTrello3Password).then(function () {

          browser1.wait(EC.presenceOf(allLabels),2000).then(function(){
            allLabels.click();
            browser1.wait(EC.presenceOf(buttonStart),2000).then(function() {
              buttonStart.click();
              protractor.common.waitForElementAndClick('#new-room-button', browser1).then(() => {
                protractor.common.waitForElement('#room-link', browser1).then(function () {
                  let roomLinkElement = element(by.css('#room-link'))
                  roomLinkElement.getAttribute('value').then(function (link) {
                    link = link.replace(browser.params.hostname + "/app.html", browser.params.hostname + ":4000/app.html");
                    browser2.get(link);
                    browser3.get(link);
                    protractor.common.waitForElementAndClick('#share-room__close', browser1).then(() => {
                      startChoices();
                    });
                  })
                })
              })
            })
          });

          function startChoices () {

            browser1.element.all(by.id("update_board")).count().then(function (size) {
              if (size === 0) {
                makeChoice(browser1, browsersPriorities[0]);
                makeChoice(browser2, browsersPriorities[1]);
                makeChoice(browser3, browsersPriorities[2]);
                let leftContinue = browser1.element.all(by.css(".card-button__continue")).get(0);
                let rightContinue = browser1.element.all(by.css(".card-button__continue")).get(1);
                let leftCard = browser1.element(by.css('#left_button .card__title'));
                let rightCard = browser1.element(by.css('#right_button .card__title'));
                protractor.common.waitForElement('.card-button__continue', browser1).then(function () {
                  protractor.common.waitForElement('#left_button .card__title', browser1).then(function () {
                    browser2.element.all(by.css(".card__voters .card__voter")).count().then(function (visibleVotesCount) {
                      expect(visibleVotesCount).toEqual(3);
                      leftCard.getText().then(function (leftValue) {
                        rightCard.getText().then(function (rightValue) {
                          if (browsersPriorities[0].indexOf(rightValue) < browsersPriorities[0].indexOf(leftValue)) {
                            rightContinue.click();
                            startChoices()
                          } else {
                            leftContinue.click();
                            startChoices()
                          }
                        });
                      });

                    })

                  });
                })
              } else {

                // browser3.close()
                // browser2.close()
                protractor.selectWindow.selectWindow(0, browser1);
                browser1.driver.manage().window().setSize(1280, 1032);
                return protractor.common.waitForElementAndClick('.trigger-button__link', browser1).then(() => {
                  protractor.common.waitForElement('div.order-recap', browser1).then(function () {
                    let recap = browser1.element.all(by.css('div.order-recap div.recap__item'));
                    // done();
                    expect(recap.getText()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
                    // recap.getText().then((txt) => {
                      // expect(txt).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
                      // browser1.close()
                    // })
                      done();
                  })
                })
                // protractor.common.waitForElementAndClick('.trigger-button__link', browser).then(() => {
                // protractor.common.waitForElement('div.order-recap', browser).then(function () {
                //   let recap = element.all(by.css('div.order-recap div.recap__item'))
                //   expect(recap.getText()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
                //   done()
                // })
                // })
              }
            });
          }

          function makeChoice (b, bPriorities) {
            let leftCard = b.element(by.css('#left_button .card__title'));
            let rightCard = b.element(by.css('#right_button .card__title'));
            protractor.common.waitForElement('#left_button .card__title', b).then(function () {
              leftCard.getText().then(function (leftValue) {
                rightCard.getText().then(function (rightValue) {
                  if (bPriorities.indexOf(rightValue) < bPriorities.indexOf(leftValue)) {
                    b.element(by.css('#right_button .container__card')).click()
                  } else {
                    b.element(by.css('#left_button .container__card')).click()
                  }
                });
              });
            }).catch(function () {
              startChoices();
            });
          }
        });
      });
    });
  });
});
