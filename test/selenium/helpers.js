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
  },

  /**
   * Closes all tabs except for one
   * @param {Number} toKeep the number of the tab (starting from 0) to keep
   */
  closeAllTabsExceptOne: function(toKeep) {
    toKeep = (toKeep === undefined) ? 0 : toKeep;

    browser.getAllWindowHandles().then(function(handles) {
      for (let i = 1; i < handles.length; i++) {
        browser.switchTo().window(handles[i]);
        browser.close();
      }
      browser.switchTo().window(handles[toKeep]);
    });
  },

  switchToMostRecentTab: function() {
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[handles.length - 1]);
    });
  }
};
