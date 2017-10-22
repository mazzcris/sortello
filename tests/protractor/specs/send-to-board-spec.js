describe('sort list asc', function() {
  it('sends data to board correctly', function() {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension.accessFromChromeExtension();
    let EC = protractor.ExpectedConditions;

    function nextChoice() {
      let leftCard = element(by.css('#left_button .card__title'));
      let rightCard = element(by.css('#right_button .card__title'));
      browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function() {
        let leftCard = element(by.css('#left_button .card__title'));
        let rightCard = element(by.css('#right_button .card__title'));

        leftCard.getText().then(function(leftValue) {
          rightCard.getText().then(function(rightValue) {
            if (Math.random() >= 0.5) {
              element(by.css('#right_button .container__card')).click();
            } else {
              element(by.css('#left_button .container__card')).click();
            }
          });
        });
        element
          .all(by.id('update_board'))
          .count()
          .then(function(size) {
            if (size == 0) {
              nextChoice();
            }
          });
      });
    }

    nextChoice();

    let recapListText;

    let showRecapButton = element(by.css('.trigger-button__link'));
    browser.wait(EC.presenceOf(showRecapButton), 20000).then(function() {
      element(by.css('.trigger-button__link')).click();
      let recapDiv = element(by.css('div.order-recap'));
      browser.wait(EC.presenceOf(recapDiv), 20000).then(function() {
        element
          .all(by.css('div.order-recap div.recap__item'))
          .getText()
          .then(function(text) {
            recapListText = text;
            let updateBoardButton = element(by.id('recap_update_board'));
            browser.wait(EC.visibilityOf(updateBoardButton), 20000).then(function() {
              browser
                .actions()
                .mouseMove(updateBoardButton)
                .click()
                .perform();
              browser.driver.sleep(1000);

              updateBoardButton = element(by.id('update_board'));
              browser.wait(EC.visibilityOf(updateBoardButton), 20000).then(function() {
                updateBoardButton.click();
              });
            });
          });
      });
    });
    let checkTrelloButton = element(by.css('.check-trello__button'));
    browser.wait(EC.visibilityOf(checkTrelloButton), 20000).then(function() {
      browser
        .actions()
        .mouseMove(checkTrelloButton)
        .click()
        .perform();
    });

    browser.driver.sleep(2000);
    protractor.selectWindow.selectWindow(1).then(function() {
      let trelloList = element(by.css('.list-cards'));
      browser.wait(EC.visibilityOf(trelloList), 20000).then(function() {
        let trelloCards = element(by.css('.list-cards')).all(by.css('.list-card-details > span'));
        expect(trelloCards.getText()).toEqual(recapListText);
      });
    });
  });
});
