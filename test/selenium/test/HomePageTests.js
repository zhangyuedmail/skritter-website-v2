"use strict";
const Config = require('../Config');
const HomePage = require('../drivers/HomePageDriver');
const chai = require('chai');
const expect = chai.expect;

describe('Home page tests', function() {
  beforeEach(function(done) {
    HomePage.navigate().then(() => {
      done();
    });
  });

  it('A user should be able to navigate to the home page from /', function(done) {
    expect('#section-features').dom.to.be.visible().then(() => {
      done();
    });
  });

  it('Logged out user should be able to go to the signup page', function(done) {
    HomePage.goToSignupFromMenu().then(() => {
      expect('#signup-submit').dom.to.be.visible().then(() => {
        done();
      });
    });
  });

  it('Logged out user should be able to go to the login page', function(done) {
    HomePage.goToLoginFromMenu().then(() => {
      expect('#button-login').dom.to.be.visible().then(() => {
        done();
      });
    });
  });

  it('Logged out user should be able to go to the features page', function(done) {
    HomePage.goToFeaturesFromMenu().then(() => {
      expect('#section-call-to-action').dom.to.be.visible().then(() => {
        done();
      });
    });
  });

  it('User should be able to go to the about page from the footer', function(done) {
    HomePage.goToAboutFromFooter().then(() => {
      expect('#about-title').dom.to.be.visible().then(() => {
        done();
      });
    });
  });

  it('User should be able to go to the legal page from the footer', function(done) {
    HomePage.goToLegalFromFooter().then(() => {
      expect('#section-content').dom.to.be.visible().then(() => {
        done();
      });
    });
  });

  it('User should be able to go to the contact page from the footer', function(done) {
    HomePage.goToContactFromFooter().then(() => {
      expect('#field-message').dom.to.be.visible().then(() => {
        done();
      });
    });
  });
});
