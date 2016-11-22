"use strict";
const Config = require('../Config');
const ContactPage = require('../drivers/ContactPageDriver');
const chai = require('chai');
const expect = chai.expect;

describe('Contact page tests', function() {
  beforeEach(function (done) {
    ContactPage.navigate().then(() => {
      done();
    });
  });

  it('Should be able to go to the contact page via /contact', function(done) {
    expect('#field-message').dom.to.be.visible().then(() => {
      done();
    });
  });

  it('A user can successfully fill in and submit feedback in the contact form', function(done) {
    ContactPage.fillInContactInfo("team@skritter.com", "feedback", "UITEST").then(() => {
      ContactPage.submitContactForm();
      ContactPage.waitForSubmissionFeedback().then(function(feedback) {
        expect('#contact-message').dom.to.be.visible();
        expect('#contact-message').dom.to.have.text(Config.strings.contactSubmitSuccess);
        expect('#contact-message').dom.to.have.htmlClass('text-success').then(function() {
          done();
        });
      });
    });
  });

});
