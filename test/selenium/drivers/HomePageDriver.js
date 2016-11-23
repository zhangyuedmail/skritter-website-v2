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
    browser.findElement(By.id('blog-link')).click();
    helpers.switchToMostRecentTab();


    return browser.wait(until.titleIs(Config.strings.titleBlog));
  },

  goToForumFromFooter: function() {
    browser.findElement(By.id('forum-link')).click();
    helpers.switchToMostRecentTab();

    return browser.wait(until.titleIs(Config.strings.titleForum));
  },

  goToFbFromFooter: function() {
    browser.findElement(By.id('fb-link')).click();
    helpers.switchToMostRecentTab();

    return browser.wait(until.titleIs(Config.strings.titleFb));
  },

  goToTwitterFromFooter: function() {
    browser.findElement(By.id('twitter-link')).click();
    helpers.switchToMostRecentTab();

    return browser.wait(until.titleIs(Config.strings.titleTwitter));
  },

  goToGPlusFromFooter: function() {
    browser.findElement(By.id('gplus-link')).click();
    helpers.switchToMostRecentTab();

    return browser.wait(until.titleIs(Config.strings.titleGPlus));
  },

  goToResourcesFromFooter: function() {
    browser.findElement(By.id('resources-link')).click();
    helpers.switchToMostRecentTab();

    return browser.wait(until.titleIs(Config.strings.titleResources));
  },

  goToFAQFromFooter: function() {
    browser.findElement(By.id('faq-link')).click();
    helpers.switchToMostRecentTab();

    return browser.wait(until.titleIs(Config.strings.titleFAQ));
  },

  navigate: function() {
    helpers.closeAllTabsExceptOne(0);

    browser.get(Config.server);
    return browser.wait(until.titleIs(Config.strings.titleHome), Config.TIMEOUT_DEFAULT);
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
