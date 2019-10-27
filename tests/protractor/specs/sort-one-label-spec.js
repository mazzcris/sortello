describe('sort list asc', function () {
  it('prioritizes the test column using undo button', function () {
      browser.ignoreSynchronization = true;
      protractor.accessFromChromeExtension.accessFromChromeExtension();
      let EC = protractor.ExpectedConditions;

      function nextChoice () {
        let leftCard = element(by.css('#left_button .card__title'));
        let rightCard = element(by.css('#right_button .card__title'));

        browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
          leftCard.getText().then(function (leftValue) {
            rightCard.getText().then(function (rightValue) {
                if (parseInt(rightValue) < parseInt(leftValue)) {
                  element(by.css('#right_button .container__card')).click()
                } else {
                  element(by.css('#left_button .container__card')).click()
                }
            });
          });
        });

        element.all(by.id("update_board")).count().then(function (size) {
          if (size == 0) {
            nextChoice();
          }
        });
      }

      let blueLabel = element(by.css('.label__item.label__blue'));
      browser.wait(EC.presenceOf(blueLabel), 20000).then(function () {
        blueLabel.click();
        nextChoice();
      })


      protractor.expectRecap.toBe(['3', '4', '6', '10']);

    }
  );

});
