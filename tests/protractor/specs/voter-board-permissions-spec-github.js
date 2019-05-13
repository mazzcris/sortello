describe('cannot vote if cannot access to board on github', function () {
    var originalTimeout;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('cannot vote if does not have access to board on github', function (done) {

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

        protractor.accessFromChromeExtensionGithub.accessFromChromeExtensionGithub(browser1).then(function () {
            protractor.accessFromChromeExtensionGithub.accessFromChromeExtensionGithub(browser2, browser.params.testGithubUsername2, browser1.params.testGithubPassword2).then(function () {
                let EC = protractor.ExpectedConditions;
                browser1.get('/app.html?extId=' + browser.params.testGithubExtId+"&fw=g");
                let newRoomButton = element(by.css('#new-room-button'))
                browser1.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
                    newRoomButton.click();
                    let roomLinkElement = element(by.css('#room-link'))
                    browser1.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
                        roomLinkElement.getAttribute('value').then(function (link) {
                            let roomKey = link.substring(
                                link.indexOf("=") + 1,
                                link.indexOf("&")
                            );
                            browser2.get('/app.html?roomKey='+roomKey+'&extId='+browser.params.testGithubExtId+'&fw=g');
                            browser2.wait(EC.presenceOf(element(by.id('container_div'))), 20000).then(function () {
                                browser.sleep(3000);
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