describe('sort list asc', function () {
  it('prioritizes the test column using undo button', function () {
      browser.ignoreSynchronization = true;
      protractor.simpleAccessFromChromeExtension.accessFromChromeExtension();
      let EC = protractor.ExpectedConditions;

      let shouldUndo = false;

      function nextChoice () {
        if (shouldUndo) {
          browser.driver.sleep(500);
          element(by.css('#undo_button')).click();
          shouldUndo = false;
          // console.log("undo");
        }

        let leftCard = element(by.css('#left_button .card__title'));
        let rightCard = element(by.css('#right_button .card__title'));

        browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
          leftCard.getText().then(function (leftValue) {
            rightCard.getText().then(function (rightValue) {
              let autoclicked = false;

              if (parseInt(rightValue) === 2 || parseInt(rightValue) === 7) {
                element(by.css('#right_button .button-blacklist')).click();
                autoclicked = true;
                // console.log("forget " + rightValue);
              }
              if (parseInt(leftValue) === 2 || parseInt(leftValue) === 7) {
                element(by.css('#left_button .button-blacklist')).click();
                autoclicked = true;
                // console.log("forget " + leftValue);
              }

              if (!autoclicked) {
                let progressBar = element(by.css(".progressive-bar__status"));
                progressBar.getAttribute("aria-valuenow").then(function (value) {
                  let progressValue = value;

                  if (parseInt(rightValue) < parseInt(leftValue)) {
                    // ProgressValue check avoids selecting wrong card as last choice
                    if (Math.random() < 0.2 && progressValue < 80) {
                      // console.log("Making the wrong choice with progressValue = "+progressValue);
                      element(by.css('#left_button .container__card')).click()
                      // console.log(leftValue);
                      shouldUndo = true;
                    } else {
                      element(by.css('#right_button .container__card')).click()
                      // console.log(rightValue);
                    }
                  } else {
                    if (Math.random() < 0.2 && progressValue < 80) {
                      // console.log("Making the wrong choice with progressValue = " + progressValue);
                      element(by.css('#right_button .container__card')).click()
                      // console.log(rightValue);
                      shouldUndo = true;
                    } else {
                      element(by.css('#left_button .container__card')).click()
                      // console.log(leftValue);
                    }
                  }
                });
              }
            });
          });
        });

        element.all(by.id("update_board")).count().then(function (size) {
          if (size === 0) {
            nextChoice();
          }
        });
      }

    let recapButton = element.all(by.css(".trigger-recap__button"));
    browser.wait(EC.presenceOf(recapButton),2000).then(function(){
      recapButton.click();
      let allLabels = element.all(by.css(".recap__content")).get(0);
      browser.wait(EC.presenceOf(allLabels),2000).then(function(){
        allLabels.click();
        let buttonStart = element(by.css('.button__start-prioritizing'));
        browser.wait(EC.presenceOf(buttonStart),2000).then(function() {
          buttonStart.click();
          nextChoice();
        });
      });
    });

      let showRecapButton = element(by.css('.trigger-button__link'));
      browser.wait(EC.presenceOf(showRecapButton), 20000).then(function () {
        element(by.css('.trigger-button__link')).click();
        let recapDiv = element(by.css('div.order-recap'));
        browser.wait(EC.presenceOf(recapDiv), 20000).then(function () {
          let recap = element.all(by.css('div.order-recap div.recap__item'));
          recap.getText().then(function (text) {
            let firstPart = text.splice(0, 8);
            let lastPart = text;
            expect(firstPart).toEqual(['1', '3', '4', '5', '6', '8', '9', '10']);
            expect(lastPart.indexOf('2')).toBeGreaterThan(-1);
            expect(lastPart.indexOf('7')).toBeGreaterThan(-1);
            expect(lastPart.length).toEqual(2);
          });
        });
      });
    }
  );

});
