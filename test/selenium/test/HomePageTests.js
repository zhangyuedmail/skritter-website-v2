"use strict";
const Config = require('../Config');
const HomePage = require('../drivers/HomePageDriver');
const chai = require('chai');
const expect = chai.expect;

describe('Home page tests', function() {
  beforeEach(function() {
    HomePage.navigate();
  });

  it('A user should be able to navigate to the home page', function (done) {
    expect('#section-features').dom.to.be.visible().then(() => {
      done();
    });
  });

  it('Logged out user should be able to go to the signup page', function (done) {
    HomePage.goToSignupFromMenu();
    expect('#signup-submit').dom.to.be.visible().then(() => {
      done();
    });
  });

  it('Logged out user should be able to go to the login page', function (done) {
    HomePage.goToLoginFromMenu();
    expect('#button-login').dom.to.be.visible().then(() => {
      done();
    });
  });
});
