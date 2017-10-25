let GelatoComponent = require('gelato/component');

/**
 * @class VocabViewerLookup
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function (options) {
    this.links = [];
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-lookup': 'handleClickLookup',
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {VocabViewerLookup}
   */
  render: function () {
    this.renderTemplate();
    return this;
  },
  /**
   * @method handleClickLookup
   * @param {Event} event
   */
  handleClickLookup: function (event) {
    event.preventDefault();
    let $selected = this.$('select option:selected');
    window.open($selected.val().replace('href-', ''), '_blank');
    app.user.set('wordDictionary', $selected.text()).cache();
  },
  /**
   * @method set
   * @param {Vocabs} vocabs
   * @returns {VocabViewerLookup}
   */
  set: function (vocabs) {
    if (vocabs && vocabs.length) {
      this.links = vocabs.at(0).get('dictionaryLinks');
    } else {
      this.links = [];
    }
    return this.render();
  },
});
