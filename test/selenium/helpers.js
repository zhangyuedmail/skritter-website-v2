const SeleniumWebdriver = require('selenium-webdriver');
const By = SeleniumWebdriver.By;
const until = SeleniumWebdriver.until;
const Config = require('./Config');
const browser = Config.driver;

module.exports = {
  waitForElement: function(locator) {
    return browser.wait(until.elementLocated(locator), Config.TIMEOUT_DEFAULT);
  },

  waitForElementVisible: function(locator) {
    var el = browser.wait(until.elementLocated(locator), Config.TIMEOUT_DEFAULT);
    return browser.wait(new until.WebElementCondition('for element to be visible ' + locator, function() {
      return el.isDisplayed().then(v => v ? el : null);
    }), Config.TIMEOUT_DEFAULT);
  }
};
