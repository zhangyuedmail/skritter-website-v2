const SeleniumWebdriver = require('selenium-webdriver');
const By = SeleniumWebdriver.By;
const until = SeleniumWebdriver.until;
const Config = require('./Config');
const browser = Config.driver;

module.exports = {
  waitForElement: function(locator) {
    return browser.wait(until.elementLocated(locator), Config.TIMEOUT_DEFAULT);
  },

  /**
   * Waits for an element to become visible
   * @param {String} locator CSS selector for the element to wait for
   * @returns {Promise} resolves when the element has become visible
   */
  waitForElementVisible: function(locator) {
    const el = browser.wait(until.elementLocated(locator), Config.TIMEOUT_DEFAULT);
    return browser.wait(new until.WebElementCondition('for element to be visible ' + locator, function() {
      return el.isDisplayed().then(v => v ? el : null);
    }), Config.TIMEOUT_DEFAULT);
  },

  /**
   * Closes all tabs except for one
   * @param {Number} [toKeep] the number of the tab (starting from 0) to keep. Defaults to 0.
   * @returns {Promise} resolves when all tabs but one have been closed
   */
  closeAllTabsExceptOne: function(toKeep) {
    toKeep = (toKeep === undefined) ? 0 : toKeep;
    const promises = [];
    const self= this;

    return new Promise(function(resolve, reject) {
      browser.getAllWindowHandles().then(function(handles) {
        for (let i = 1; i < handles.length; i++) {
          promises.push(self.closeTab(handles, i));
        }

        Promise.all(promises).then(function() {
          browser.switchTo().window(handles[toKeep]).then(resolve);
        });
      });
    });
  },

  /**
   * Closes a specific browser tab
   * @param {Object[]} handles
   * @param {Number} tabNum the position in the array of the tab to close
   * @returns {Promise}
   */
  closeTab: function(handles, tabNum) {
    return new Promise(function (resolve, reject) {
      browser.switchTo().window(handles[tabNum]).then(() => {
        browser.close().then(() => {
          resolve();
        });
      });
    });
  },

  /**
   * Switches the active browser context to the most recently opened tab.
   * @returns {Promise} resolves when the context has been switched
   */
  switchToMostRecentTab: function() {
    return new Promise(function(resolve, reject) {

      // The browser is unreliable and not to be trusted. Or I'm using the lib wrong.
      // Likely both.
      // There seems to be a race condition between when a link
      // opened with click() completes and the window handle is registered with
      // the browser.
      setTimeout(() => {
        browser.getAllWindowHandles().then(function(handles) {
          const lastTabIndex = Math.max(handles.length - 1, 0);
          browser.switchTo().window(handles[lastTabIndex]).then(() => {
            resolve();
          });
        });
      }, 50);
    });
  }
};
