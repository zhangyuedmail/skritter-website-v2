"use strict";
const Config = require('../Config');
const InstitutionsPage = require('../drivers/InstitutionsPageDriver');
const chai = require('chai');
const expect = chai.expect;

describe('Institutions page tests', function() {
  beforeEach(function (done) {
    InstitutionsPage.navigate().then(() => {
      done();
    });
  });

  it('Should be able to go to the contact page via /institutions', function(done) {
    expect('#purchase-license').dom.to.be.visible();
    expect('#request-submit').dom.to.be.visible().then(() => {
      done();
    });
  });

  it('A user can successfully fill in and submit the trial request form', function(done) {
    InstitutionsPage.fillInInstitutionInfo({
      email: "team@skritter.com",
      schoolName: "UITEST University",
      message: "UITEST"
    }).then(() => {
      InstitutionsPage.submitContactForm();
      InstitutionsPage.waitForSubmissionFeedback().then(function(feedback) {
        expect('#request-message').dom.to.be.visible();
        expect('#request-message').dom.to.have.text(Config.strings.institutionsSubmitSuccess);
        expect('#request-message').dom.to.have.htmlClass('text-success').then(function() {
          done();
        });
      });
    });
  });

});
