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

  it('Should be able to go to the contact page via /contact', function() {
    expect('#field-message').dom.to.be.visible();
  });

  it('Can fill in and submit contact form request', function(done) {
    ContactPage.fillInContactInfo("team@skritter.com", "feedback", "UITEST");
    // TODO
    done();
  });

});
