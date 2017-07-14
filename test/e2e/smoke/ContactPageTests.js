const Config = require('../Config');

module.exports = {
  after: function(client) {
    client.end();
  },

  beforeEach: function(client) {
    client.url(Config.server + '/contact');
    // TODO: wait until some element is visible so we know the loader is gone at that point
  },

  'Can load contact us page': function(client) {
    client.pause(1000);
    client.assert.title(Config.strings.titleContact);
    client.expect.element('#field-message').to.be.visible;
  }
};