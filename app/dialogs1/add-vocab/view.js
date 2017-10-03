let GelatoDialog = require('gelato/dialog');
let Content = require('./content/view');
let Vocablists = require('collections/VocablistCollection');

/**
 * @class AddVocabConfirm
 * @extends {GelatoDialog}
 */
let AddVocabConfirm = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function (options) {
    options = options || {};
    this.content = new Content({dialog: this});
    this.vocablists = new Vocablists();
    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'custom',
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
      },
    });
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {},
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {AddVocabConfirm}
   */
  render: function () {
    this.renderTemplate();
    this.content.setElement('#content-container').render();
    return this;
  },
});

module.exports = AddVocabConfirm;
