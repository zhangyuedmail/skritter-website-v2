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
const HomePageDriver = {
  /**
   * Logged out menu actions
   * @todo refactor into a separate suite of menu tests
   */

  goToSignupFromMenu: function() {
    browser.findElement(By.id('menu-sign-up-btn')).click();
    return browser.wait(until.titleIs('Signup - Skritter'));
  },

  goToLoginFromMenu: function() {
    browser.findElement(By.id('menu-log-in-btn')).click();
    return browser.wait(until.titleIs('Login - Skritter'));
  },

  goToFeaturesFromMenu: function() {
    browser.findElement(By.id('features-link')).click();
    return browser.wait(until.elementLocated(By.id('section-call-to-action')));
  },

  /**
   * Footer links
   * @todo refactor into a separate suite of Footer tests
   */

  goToAboutFromFooter: function() {
    browser.findElement(By.id('about-link')).click();
    return browser.wait(until.titleIs('About Us - Skritter'));
  },

  goToContactFromFooter: function() {
    browser.findElement(By.id('contact-link')).click();
    return browser.wait(until.titleIs('Contact - Skritter'));
  },

  goToLegalFromFooter: function() {
    browser.findElement(By.id('legal-link')).click();
    return browser.wait(until.titleIs('Legal - Skritter'));
  },


  navigate: function() {
    browser.get(Config.server);
    return browser.wait(until.titleIs('Skritter - Learn to Write Chinese and Japanese Characters'), Config.TIMEOUT_DEFAULT);
  },

  playPromoVideo: function() {
    // TODO
  },

  /**
   * Shuts down selenium server. Should be called after all the tests are run.
   */
  after: function() {
    browser.quit();
  }
};

module.exports = HomePageDriver;
