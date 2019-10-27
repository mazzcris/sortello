module.exports.accessFromChromeExtensionGithub = function (b = null, username = null, password = null) {
    return new Promise(function (resolve, reject) {
        if (b !== null) {
            browser = b;
        }
        browser.ignoreSynchronization = true;
        browser.get('/app.html?extId=' + browser.params.testGithubExtId + "&fw=g");
        let EC = protractor.ExpectedConditions;
        let continueButton = browser.element(by.css('.continue-to-choices--button'));
        browser.wait(EC.presenceOf(continueButton), 20000).then(function () {
            continueButton.click()
            let labelUsername = browser.element(by.css("#login_field"))
            let labelPassword = browser.element(by.css("#password"))
            browser.wait(EC.presenceOf(labelUsername), 20000).then(function () {
                if(username !== null && password !== null){
                    labelUsername.sendKeys(username)
                    labelPassword.sendKeys(password)
                }else{
                    labelUsername.sendKeys(browser.params.testGithubUsername)
                    labelPassword.sendKeys(browser.params.testGithubPassword)
                }
                let signInButton = browser.element(by.css(".btn.btn-primary.btn-block"))
                signInButton.click()
                let buttonAuthorize = browser.element(by.css("#js-oauth-authorize-btn"))
                browser.wait(EC.visibilityOf(buttonAuthorize), 5000).then(function () {
                    browser.driver.sleep(2000);
                    buttonAuthorize.click()
                    resolve("Logged in");
                },function(){
                    resolve("Logged in");
                })
            })
        })
    })
}