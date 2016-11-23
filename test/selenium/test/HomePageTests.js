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

  it('User should be able to view the Skritter blog from the footer', function(done) {
    HomePage.goToBlogFromFooter().then(() => {
      expect('body').dom.to.have.htmlClass('blog').then(() => {
        done();
      });
    });
  });

  it('User should be able to view the Skritter forum from the footer', function(done) {
    HomePage.goToForumFromFooter().then(() => {
      expect('#site-logo').dom.to.have.attribute('alt', 'Skritter Forum').then(() => {
        done();
      });
    });
  });
/*
  it('User should be able to view the Skritter Facebook page from the footer', function(done) {
    HomePage.goToFbFromFooter().then(() => {
      expect('html').dom.to.have.attribute('id', 'facebook').then(() => {
        done();
      });
    });
  });

  it('User should be able to view the Skritter Twitter page from the footer', function(done) {
    HomePage.goToTwitterFromFooter().then(() => {
      expect('.ProfileHeaderCard-nameLink').dom.to.have.text('Skritter').then(() => {
        done();
      });
    });
  });
/*
  it('User should be able to view the Skritter Google Plus page from the footer', function(done) {
    HomePage.goToGPlusFromFooter().then(() => {
      expect('#field-message').dom.to.be.visible().then(() => {
        done();
      });
    });
  });

  it('User should be able to view the Resources page from the footer', function(done) {
    HomePage.goToResourcesFromFooter().then(() => {
      expect('#field-message').dom.to.be.visible().then(() => {
        done();
      });
    });
  });

  it('User should be able to view the FAQ page from the footer', function(done) {
    HomePage.goToFAQFromFooter().then(() => {
      expect('#field-message').dom.to.be.visible().then(() => {
        done();
      });
    });
  });*/
});
