describe('dotvoting with github', function () {
    let originalTimeout;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('works also for github', function (done) {

        browser.ignoreSynchronization = true;
        browser.driver.manage().window().setSize(840, 524);
        browser.driver.manage().window().setPosition(0, 0);
        browser.driver.manage().window().toolbar = 0;
        browser.driver.manage().window().menubar = 0;

        let browser1 = browser

        let browser2 = browser.forkNewDriverInstance();
        browser2.ignoreSynchronization = true;
        browser2.driver.manage().window().setSize(840, 524);
        browser2.driver.manage().window().setPosition(840, 0);

        let browsersPriorities = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
        ]


        protractor.accessFromChromeExtensionGithub.accessFromChromeExtensionGithub(browser1).then(function () {
            protractor.accessFromChromeExtensionGithub.accessFromChromeExtensionGithub(browser2).then(function () {

                let EC = protractor.ExpectedConditions;
                let newRoomButton = element(by.css('#new-room-button'))
                browser1.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
                    newRoomButton.click();
                    let roomLinkElement = element(by.css('#room-link'))
                    browser1.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
                        roomLinkElement.getAttribute('value').then(function (link) {
                            browser2.get(link.replace(browser.params.hostname + "/app.html", browser.params.hostname + ":4000/app.html"))
                            let closeNewRoomModalLink1 = browser1.element(by.css('#share-room__close'))
                            browser1.wait(EC.presenceOf(closeNewRoomModalLink1), 20000).then(function () {
                                closeNewRoomModalLink1.click();
                                startChoices()
                            })
                        })
                    })
                })

                function startChoices() {
                    for (let i = 0; i < 5; i++) {
                        makeChoice(browser1, browsersPriorities[0]);
                        makeChoice(browser2, browsersPriorities[1]);
                        expectCardsToBeTheSame(browser1, browser2);
                    }
                    browser1.close()
                    browser2.close()
                    done()
                }

                function makeChoice(b, bPriorities) {
                    b.element.all(by.css(".card-button__continue")).count().then(function (size) {
                        if (size > 0) {
                            let leftContinue = b.element.all(by.css(".card-button__continue")).get(0);
                            let rightContinue = b.element.all(by.css(".card-button__continue")).get(1);
                            let leftCard = b.element(by.css('#left_button .card__title'));
                            let rightCard = b.element(by.css('#right_button .card__title'));
                            b.wait(EC.and(EC.presenceOf(leftContinue), EC.presenceOf(rightContinue)), 20000).then(function () {
                                b.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
                                    leftCard.getText().then(function (leftValue) {
                                        rightCard.getText().then(function (rightValue) {
                                            if (bPriorities.indexOf(rightValue) < bPriorities.indexOf(leftValue)) {
                                                rightContinue.click()
                                            } else {
                                                leftContinue.click()
                                            }
                                        });
                                    });
                                });
                            })
                        }
                        else {
                            let leftCard = b.element(by.css('#left_button .card__title'));
                            let rightCard = b.element(by.css('#right_button .card__title'));
                            let leftButton = b.element(by.css('#left_button .container__card'));
                            let rightButton = b.element(by.css('#right_button .container__card'));

                            b.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
                                leftCard.getText().then(function (leftValue) {
                                    rightCard.getText().then(function (rightValue) {
                                        if (bPriorities.indexOf(rightValue) < bPriorities.indexOf(leftValue)) {
                                            b.wait(EC.and(EC.elementToBeClickable(rightButton)), 20000).then(function () {
                                                b.actions().mouseMove(rightButton).click().perform();
                                                // rightButton.click()
                                            })
                                        } else {
                                            b.wait(EC.and(EC.elementToBeClickable(leftButton)), 20000).then(function () {
                                                b.actions().mouseMove(leftButton).click().perform();
                                                // leftButton.click()
                                            })
                                        }
                                    });
                                });
                            });
                        }
                    })
                }

                function expectCardsToBeTheSame(browserA, browserB) {
                    let leftCardA = browserA.element(by.css('#left_button .card__title'));
                    let rightCardA = browserA.element(by.css('#right_button .card__title'));
                    let leftCardB = browserB.element(by.css('#left_button .card__title'));
                    let rightCardB = browserB.element(by.css('#right_button .card__title'));
                    browserA.wait(EC.and(EC.presenceOf(leftCardA), EC.presenceOf(rightCardA)), 20000).then(function () {
                        browserB.wait(EC.and(EC.presenceOf(leftCardB), EC.presenceOf(rightCardB)), 20000).then(function () {
                            leftCardA.getText().then(function (leftValueA) {
                                rightCardA.getText().then(function (rightValueA) {
                                    leftCardB.getText().then(function (leftValueB) {
                                        rightCardB.getText().then(function (rightValueB) {
                                            expect(leftValueA).toEqual(leftValueB)
                                            expect(rightValueA).toEqual(rightValueB)
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            })
        },function(e){
            console.log("Errore = "+e);
        })
    })
})