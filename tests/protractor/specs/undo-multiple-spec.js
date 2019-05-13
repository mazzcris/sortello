describe('sort with multiple undo clicks', function () {
  it('prioritizes the test column using undo button', function () {
      browser.ignoreSynchronization = true;
      protractor.simpleAccessFromChromeExtension.accessFromChromeExtension();
      let EC = protractor.ExpectedConditions;

      let shouldUndo = false;

      function nextChoice () {
        if (shouldUndo) {
          let times = Math.floor(Math.random() * (4 - 1)) + 1;
          while (times > 0) {
            browser.driver.sleep(200);
            element(by.css('#undo_button')).click();
            times--;
          }
          shouldUndo = false;
        }

        let leftCard = element(by.css('#left_button .card__title'));
        let rightCard = element(by.css('#right_button .card__title'));

        browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
          leftCard.getText().then(function (leftValue) {
            rightCard.getText().then(function (rightValue) {

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
            });
          });
        });

        element.all(by.id("update_board")).count().then(function (size) {
          if (size == 0) {
            nextChoice();
          }
        });
      }

      let allLabels = element.all(by.tagName('option')).get(1);
      browser.wait(EC.presenceOf(allLabels),2000).then(function(){
          allLabels.click();
          let buttonStart = element(by.css('.button__start-prioritizing'));
          browser.wait(EC.presenceOf(buttonStart),2000).then(function(){
              buttonStart.click();
              nextChoice();
          });
      });

      let results = element(by.id('update_board'));
      browser.wait(EC.presenceOf(results), 50000).then(function () {
      protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    })
  });
});
