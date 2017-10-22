describe('sort list forget', function() {
  it('prioritizes the test column in ascending order blacklisting the cards "2" and "7"', function() {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension.accessFromChromeExtension();
    let EC = protractor.ExpectedConditions;

    function nextChoice() {
      let leftCard = element(by.css('#left_button .card__title'));
      let rightCard = element(by.css('#right_button .card__title'));

      browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function() {
        leftCard.getText().then(function(leftValue) {
          rightCard.getText().then(function(rightValue) {
            let autoclicked = false;

            if (parseInt(rightValue) === 2 || parseInt(rightValue) === 7) {
              element(by.css('#right_button .button-blacklist')).click();
              autoclicked = true;
            }
            if (parseInt(leftValue) === 2 || parseInt(leftValue) === 7) {
              element(by.css('#left_button .button-blacklist')).click();
              autoclicked = true;
            }

            if (!autoclicked) {
              if (parseInt(rightValue) < parseInt(leftValue)) {
                element(by.css('#right_button .container__card')).click();
              } else {
                element(by.css('#left_button .container__card')).click();
              }
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

    let showRecapButton = element(by.css('.trigger-button__link'));
    browser.wait(EC.presenceOf(showRecapButton), 20000).then(function() {
      element(by.css('.trigger-button__link')).click();
      let recapDiv = element(by.css('div.order-recap'));
      browser.wait(EC.presenceOf(recapDiv), 20000).then(function() {
        let recap = element.all(by.css('div.order-recap div.recap__item'));
        recap.getText().then(function(text) {
          let firstPart = text.splice(0, 8);
          let lastPart = text;
          expect(firstPart).toEqual(['1', '3', '4', '5', '6', '8', '9', '10']);
          expect(lastPart.indexOf('2')).toBeGreaterThan(-1);
          expect(lastPart.indexOf('7')).toBeGreaterThan(-1);
          expect(lastPart.length).toEqual(2);
        });
      });
    });
  });
});
