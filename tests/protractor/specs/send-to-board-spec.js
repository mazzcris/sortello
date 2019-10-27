describe('sort list asc', function () {
    it('sends data to board correctly', function () {
        browser.ignoreSynchronization = true;
        protractor.simpleAccessFromChromeExtension.accessFromChromeExtension();
        let EC = protractor.ExpectedConditions;

        function nextChoice() {
            let leftCard = element(by.css('#left_button .card__title'));
            let rightCard = element(by.css('#right_button .card__title'));
            browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 40000).then(function () {
                let leftCard = element(by.css('#left_button .card__title'));
                let rightCard = element(by.css('#right_button .card__title'));

                leftCard.getText().then(function () {
                    rightCard.getText().then(function () {
                        if (Math.random() >= 0.5) {
                            element(by.css('#right_button .container__card')).click()
                        } else {
                            element(by.css('#left_button .container__card')).click()
                        }
                    });
                });
                element.all(by.id("update_board")).count().then(function (size) {
                    if (size === 0) {
                        nextChoice();
                    }
                });
            })
        }

        let allLabel = element(by.css('.label__item.label__none'));
        browser.wait(EC.presenceOf(allLabel), 40000).then(function () {
            allLabel.click();
            nextChoice();
        });

        let recapListText;

        let showRecapButton = element(by.css('.trigger-button__link'));
        browser.wait(EC.presenceOf(showRecapButton), 40000).then(function () {
            showRecapButton.click();
            let recapDiv = element(by.css('div.order-recap'));
            browser.wait(EC.presenceOf(recapDiv), 40000).then(function () {
                element.all(by.css('div.order-recap div.recap__item')).getText().then(function (text) {
                    recapListText = text;
                    let updateBoardButton = element(by.id('recap_update_board'));
                    browser.wait(EC.visibilityOf(updateBoardButton), 40000).then(function () {
                        browser.actions().mouseMove(updateBoardButton).click().perform();
                        browser.driver.sleep(1000);
                        updateBoardButton = element(by.id('update_board'));
                        browser.wait(EC.visibilityOf(updateBoardButton), 40000).then(function () {
                            browser.actions().mouseMove(updateBoardButton).click().perform();
                        });

                    });

                });
            });
        });
        let checkTrelloButton = element(by.css('.check-sortello__button'));
        browser.wait(EC.visibilityOf(checkTrelloButton), 40000).then(function () {
            browser.actions().mouseMove(checkTrelloButton).click().perform();
        });

        browser.driver.sleep(2000);
        protractor.selectWindow.selectWindow(1, browser).then(function () {
            let trelloList = element(by.css('.list-cards'));
            browser.wait(EC.visibilityOf(trelloList), 40000).then(function () {
                let trelloCards = element.all(by.css('.list-cards')).first().all(by.css('.list-card-details > span'));
                expect(trelloCards.getText()).toEqual(recapListText);
            });
        });
    });
});
