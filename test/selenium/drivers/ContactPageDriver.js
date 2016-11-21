"use strict";
const SeleniumWebdriver = require('selenium-webdriver');
const By = SeleniumWebdriver.By;
const until = SeleniumWebdriver.until;
const Config = require('../Config');
const browser = Config.driver;

/**
 * A static helper object with commands and interactions that can be performed
 * with the home page.
 * @type {Object<String, Function>}
 */
const ContactPageDriver = {

  navigate: function() {
    browser.get(Config.server + '/contact');
    return browser.wait(until.titleIs('Contact - Skritter'), Config.TIMEOUT_DEFAULT);
  },

  fillInContactInfo: function(email, topic, message) {
    // TODO
  },

  /**
   * Shuts down selenium server. Should be called after all the tests are run.
   */
  after: function() {
    browser.quit();
  }
};

module.exports = ContactPageDriver;
