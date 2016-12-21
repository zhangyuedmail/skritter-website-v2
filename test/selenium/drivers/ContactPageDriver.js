"use strict";
const SeleniumWebdriver = require('selenium-webdriver');
const By = SeleniumWebdriver.By;
const until = SeleniumWebdriver.until;
const Config = require('../Config');
const browser = Config.driver;
const helpers = require('../helpers');

/**
 * A static helper object with commands and interactions that can be performed
 * with the home page.
 * @type {Object<String, Function>}
 */
const ContactPageDriver = {

  navigate: function() {
    return new Promise(function(resolve, reject) {
      browser.get(Config.server + '/contact');
      browser.wait(until.titleIs('Contact - Skritter'), Config.TIMEOUT_DEFAULT).then(() => {

        // to avoid screenloader fadeout when testing for element visibility
        setTimeout(() => {
          resolve();
        }, 50);
      });
    });
  },

  fillInContactInfo: function(email, topic, message) {
    var p1 = browser.findElement(By.id('field-email')).sendKeys(email);
    // TODO: figure out how to set this with selenium
    // browser.findElement(By.id('field-topic-select'));
    var p2 = browser.findElement(By.id('field-message')).sendKeys(message);

    return Promise.all([p1, p2]);
  },

  submitContactForm: function() {
    return browser.findElement(By.id('contact-submit')).click();
  },

  waitForSubmissionFeedback: function() {
    return new Promise(function(resolve, reject) {
      helpers.waitForElementVisible(By.id("contact-message")).getText().then(function(text) {
        if (!text) {
          reject();
        } else {
          resolve(text);
        }
      });
    });
  },

  /**
   * Shuts down selenium server. Should be called after all the tests are run.
   */
  after: function() {
    browser.quit();
  }
};

module.exports = ContactPageDriver;
