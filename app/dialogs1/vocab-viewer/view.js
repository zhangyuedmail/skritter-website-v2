const GelatoDialog = require('gelato/dialog');
const Content = require('dialogs1/vocab-viewer/content/view');

/**
 * @class VocabViewer
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.content = new Content({dialog: this});
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {VocabViewer}
   */
  render: function() {
    this.renderTemplate();
    this.content.setElement('#content-container').render();

    return this;
  },

  /**
   * @method load
   * @param {String} vocabId
   * @returns {VocabViewer}
   */
  load: function(vocabId, vocab) {
    this.content.loadVocab(vocabId, vocab);

    return this;
  },

  /**
   * @method remove
   * @returns {VocabViewer}
   */
  remove: function() {
    this.content.remove();

    return GelatoDialog.prototype.remove.call(this);
  }
});
