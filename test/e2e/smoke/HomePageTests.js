module.exports = {
  after: function(client) {
    client.end();
  },

  beforeEach: function(client) {
    client.url('http://localhost:3000');
  },

  'Can load homepage': function(client) {
    console.log()
    client.assert.title('Skritter - Learn to Write Chinese and Japanese Characters');
    client.expect.element('#section-features').to.be.visible;
  },

  'Logged out user should be able to go to the signup page': function(client) {
    client.click('#menu-sign-up-btn')
      .waitForElementVisible('#signup-submit', 15000);
  }
};