describe('handle 0-1 card error', function () {
    it('handle 0-1 card error', function () {

        browser.ignoreSynchronization = true;
        protractor.simpleAccessFromChromeExtension.accessFromChromeExtension()
        let EC = protractor.ExpectedConditions;

        browser.get('/app.html?extId=error');
        browser.wait(EC.presenceOf(element(by.id('container_div'))), 20000).then(function () {
            expect(browser.element(by.id('container_div')).getText()).toMatch(/.*0 or 1 card.*/)
        });
    });
});
