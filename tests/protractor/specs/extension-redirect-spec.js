describe('sort list', function () {
  it('prioritizes the test column in defined order', function () {

    browser.ignoreSynchronization = true;

    let urlChanged = function(url) {
      return function () {
        return browser.getCurrentUrl().then(function(actualUrl) {
          return url !== actualUrl;
        });
      };
    };
    browser.get('/?extId=' + (process.env.TEST_TRELLO_EXTID || browser.params.testTrelloExtId));
    browser.wait(urlChanged('/app.html?extId=' + (process.env.TEST_TRELLO_EXTID || browser.params.testTrelloExtId)), 5000);
  });
});
