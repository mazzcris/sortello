describe('using Github Api', function () {
    it('sends data to board correctly', function () {
            browser.ignoreSynchronization = true;
            let EC = protractor.ExpectedConditions;

            function nextChoice() {
                let leftCard = element(by.css('#left_button .card__title'));
                let rightCard = element(by.css('#right_button .card__title'));
                browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
                    let leftCard = element(by.css('#left_button .card__title'));
                    let rightCard = element(by.css('#right_button .card__title'));

                    leftCard.getText().then(function (leftValue) {
                        rightCard.getText().then(function (rightValue) {
                            if (Math.random() >= 0.5) {
                                element(by.css('#right_button .container__card')).click()
                            } else {
                                element(by.css('#left_button .container__card')).click()
                            }
                        });
                    })
                    element.all(by.id("update_board")).count().then(function (size) {
                        if (size == 0) {
                            nextChoice();
                        }
                    });
                })
            }


            function chooseLabels() {
                let chooselabels = element(by.css('.label__none'))
                browser.wait(EC.presenceOf(chooselabels), 2000).then(function () {
                    chooselabels.click()
                    waitContainerCards()
                }).catch(function () {
                    waitContainerCards()
                })
            }

            function waitContainerCards() {
                let containerCard = element(by.css('.container__card'))
                browser.wait(EC.presenceOf(containerCard), 20000).then(function () {
                    nextChoice()
                })
            }

            browser.get('/app.html?extId=' + browser.params.testGithubExtId + '&fw=g');
            let continueButton = element(by.css(".continue-to-choices--button"))
            browser.wait(EC.presenceOf(continueButton), 20000).then(function () {
                continueButton.click()
                let labelUsername = element(by.css("#login_field"))
                let labelPassword = element(by.css("#password"))
                browser.wait(EC.presenceOf(labelUsername), 20000).then(function () {
                    labelUsername.sendKeys(browser.params.testGithubUsername)
                    labelPassword.sendKeys(browser.params.testGithubPassword)
                    let signInButton = element(by.css(".btn.btn-primary.btn-block"))
                    signInButton.click()
                    let buttonAuthorize = element(by.css("#js-oauth-authorize-btn"))
                    browser.wait(EC.visibilityOf(buttonAuthorize), 2000).then(function () {
                        browser.driver.sleep(2000);
                        buttonAuthorize.click()
                        chooseLabels()
                    }).catch(function () {
                        chooseLabels()
                    })
                })
            })
            let showRecapButton = element(by.css('.trigger-button__link'));
            browser.wait(EC.presenceOf(showRecapButton), 20000).then(function () {
                showRecapButton.click();
                let recapDiv = element(by.css('div.order-recap'));
                browser.wait(EC.presenceOf(recapDiv), 20000).then(function () {
                    element.all(by.css('div.order-recap div.recap__item')).getText().then(function (text) {
                        recapListText = text;
                        let updateBoardButton = element(by.id('recap_update_board'));
                        browser.wait(EC.visibilityOf(updateBoardButton), 20000).then(function () {
                            browser.actions().mouseMove(updateBoardButton).click().perform();
                            browser.driver.sleep(1000);
                        });
                    });
                });
            });
            let checkTrelloButton = element(by.css('.check-sortello__button'));
            browser.wait(EC.visibilityOf(checkTrelloButton), 50000).then(function () {
                browser.actions().mouseMove(checkTrelloButton).click().perform();
            });

            browser.driver.sleep(2000);
            protractor.selectWindow.selectWindow(1, browser).then(function () {
                let githubList = element(by.css('.js-project-column-cards.js-card-drag-container'));
                browser.wait(EC.presenceOf(githubList), 50000).then(function () {
                    let githubCards = element(by.css('.js-project-column-cards.js-card-drag-container')).all(
                        by.css('.js-comment-body > p'));
                    expect(githubCards.getText()).toEqual(recapListText);
                });
            });
        }
    );
})