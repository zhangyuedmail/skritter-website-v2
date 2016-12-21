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
const HomePageDriver = {
  /**
   * Logged out menu actions
   * @todo refactor into a separate suite of menu tests
   */

  goToSignupFromMenu: function() {
    browser.findElement(By.id('menu-sign-up-btn')).click();
    return browser.wait(until.titleIs(Config.strings.titleSignup));
  },

  goToLoginFromMenu: function() {
    browser.findElement(By.id('menu-log-in-btn')).click();
    return browser.wait(until.titleIs(Config.strings.titleLogin));
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
    return browser.wait(until.titleIs(Config.strings.titleAbout));
  },

  goToContactFromFooter: function() {
    browser.findElement(By.id('contact-link')).click();
    return browser.wait(until.titleIs(Config.strings.titleContact));
  },

  goToLegalFromFooter: function() {
    browser.findElement(By.id('legal-link')).click();
    return browser.wait(until.titleIs(Config.strings.titleLegal));
  },

  goToBlogFromFooter: function() {
    return this._clickLinkByIdAndWaitForTitle('blog-link', 'titleBlog');
  },

  goToForumFromFooter: function() {
    return this._clickLinkByIdAndWaitForTitle('forum-link', 'titleForum');
  },

  goToFbFromFooter: function() {
    return this._clickLinkByIdAndWaitForTitle('fb-link', 'titleFb');
  },

  goToTwitterFromFooter: function() {
    return this._clickLinkByIdAndWaitForTitle('twitter-link', 'titleTwitter');
  },

  goToGPlusFromFooter: function() {
    return this._clickLinkByIdAndWaitForTitle('gplus-link', 'titleGPlus');
  },

  goToResourcesFromFooter: function() {
    return this._clickLinkByIdAndWaitForTitle('resources-link', 'titleResources');
  },

  goToFAQFromFooter: function() {
    return this._clickLinkByIdAndWaitForTitle('faq-link', 'titleFAQ');
  },

  /**
   * Clicks a link on the current browser window, switches to a new tab
   * (if it was opened), then waits until the title is the expected
   * result to resolve.
   * @param {String} id the id of the link element to click
   * @param {String} title the key in the config strings dictionary of the expected page title
   * @returns {Promise} resolves when the title matches
   * @private
   */
  _clickLinkByIdAndWaitForTitle: function(id, title) {
    return new Promise(function(resolve, reject) {
      browser.findElement(By.id(id)).click().then(() => {
        helpers.switchToMostRecentTab().then(() => {
          browser.wait(until.titleIs(Config.strings[title])).then(resolve);
        });
      });
    });
  },

  navigate: function() {
    return new Promise(function(resolve, reject) {
      helpers.closeAllTabsExceptOne(0).then(() => {
        browser.get(Config.server);
        browser.wait(until.titleIs(Config.strings.titleHome), Config.TIMEOUT_DEFAULT).then(resolve);
      });
    });
  },

  /**
   * Shuts down selenium server. Should be called after all the tests are run.
   */
  after: function(done) {
    helpers.closeAllTabsExceptOne(0).then(() => {
      done();
    });
  }
};

module.exports = HomePageDriver;
