describe('cannot vote if ext is wrong', function () {
    var originalTimeout;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('cannot vote if ext is wrong', function (done) {

        browser.ignoreSynchronization = true;
        browser.driver.manage().window().setSize(840, 1032);
        browser.driver.manage().window().setPosition(0, 0);
        browser.driver.manage().window().toolbar = 0;
        browser.driver.manage().window().menubar = 0;

        let browser1 = browser;

        let browser2 = browser.forkNewDriverInstance();
        browser2.ignoreSynchronization = true;
        browser2.driver.manage().window().setSize(840, 524);
        browser2.driver.manage().window().setPosition(840, 0);

        protractor.accessFromChromeExtension.accessFromChromeExtension(browser1).then(function () {
            protractor.accessFromChromeExtension.accessFromChromeExtension(browser2).then(function () {
                let EC = protractor.ExpectedConditions;
                browser1.get('/app.html?extId=' + browser.params.testTrelloPrivateBoardExtId);
                let newRoomButton = element(by.css('#new-room-button'));
                browser1.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
                    newRoomButton.click();
                    let roomLinkElement = element(by.css('#room-link'));
                    browser1.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
                        roomLinkElement.getAttribute('value').then(function (link) {
                            let extId = link.substring(
                                link.indexOf("&") + 1,
                                link.lastIndexOf("&")
                            );
                            let linkModified = link.replace(browser.params.hostname + "/app.html", browser.params.hostname + ":4000/app.html");
                            linkModified = linkModified.replace(extId,"extId=AAAAAAA");
                            browser2.get(linkModified);

                            browser2.wait(EC.presenceOf(element(by.id('container_div'))), 20000).then(function () {
                                browser.sleep(2000);
                                expect(browser2.element(by.id('container_div')).getText()).toMatch(/.*Url isn't correct.*/);
                                browser2.element.all(by.id("second_div")).count().then(function (count) {
                                    expect(count).toEqual(0)
                                })
                            });

                            let fw = link.substring(
                                link.lastIndexOf("&") + 1
                            );
                            linkModified = link.replace(browser.params.hostname + "/app.html", browser.params.hostname + ":4000/app.html");
                            linkModified = linkModified.replace(fw,"fw=AAAAAA");
                            browser2.get(linkModified);

                            browser2.wait(EC.presenceOf(element(by.id('container_div'))), 20000).then(function () {
                                browser.sleep(2000);
                                expect(browser2.element(by.id('container_div')).getText()).toMatch(/.*Url isn't correct.*/);
                                browser2.element.all(by.id("second_div")).count().then(function (count) {
                                    expect(count).toEqual(0)
                                })
                            });

                            let roomKey = link.substring(
                                link.indexOf("?") + 1,
                                link.indexOf("&")
                            );
                            linkModified = link.replace(browser.params.hostname + "/app.html", browser.params.hostname + ":4000/app.html");
                            linkModified = linkModified.replace(roomKey,"roomKey=AAAA");
                            browser2.get(linkModified);

                            browser2.wait(EC.presenceOf(element(by.id('container_div'))), 20000).then(function () {
                                browser.sleep(2000);
                                expect(browser2.element(by.id('container_div')).getText()).toMatch(/.*Url isn't correct.*/);
                                browser2.element.all(by.id("second_div")).count().then(function (count) {
                                    expect(count).toEqual(0);
                                    browser2.close();
                                    browser1.close();
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
