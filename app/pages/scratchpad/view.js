var GelatoPage = require('gelato/page');
var Vocabs = require('collections/vocabs');
var Prompt = require('components/study/prompt/view');

/**
 * @class Scratchpad
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    ScreenLoader.show();
    this.part = options.part;
    this.prompt = new Prompt({page: this});
    this.vocabs = new Vocabs();
    this.vocabId = app.fn.mapper.toBase(options.writing);
    this.writing = options.writing;
    this.load();
  },

  /**
   * @property showFooter
   * @type {Boolean}
   */
  showFooter: false,

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Scratchpad - Skritter',

  /**
   * @method render
   * @returns {Scratchpad}
   */
  render: function() {
    this.renderTemplate();
    this.prompt.setElement('#study-prompt-container').render();

    return this;
  },
  /**
   * @method load
   */
  load: function() {
    async.waterfall([
      _.bind(function(callback) {
        this.vocabs.fetch({
          data: {
            include_decomps: true,
            include_sentences: true,
            include_strokes: true,
            ids: this.vocabId
          },
          error: function(vocabs, error) {
            callback(error);
          },
          success: function(vocabs) {
            callback(null, vocabs.at(0));
          }
        });
      }, this),
      _.bind(function(vocab, callback) {
        if (vocab.has('containedVocabIds')) {
          this.vocabs.fetch({
            data: {
              include_decomps: true,
              include_sentences: true,
              include_strokes: true,
              ids: vocab.get('containedVocabIds').join('|')
            },
            error: function(error) {
              callback(error);
            },
            remove: false,
            success: function() {
              callback(null, vocab);
            }
          });
        } else {
          callback(null, vocab);
        }
      }, this)
    ], _.bind(function(error, vocab) {
      if (error) {
        //TODO: display error message to user
        console.error('SCRATCHPAD LOAD ERROR:', error);
      } else {
        this.reviews = vocab.getPromptItems(this.part || 'rune');
        this.prompt.set(this.reviews);
        ScreenLoader.hide();
      }
    }, this));
  },

  /**
   * @method remove
   * @returns {Study}
   */
  remove: function() {
    this.prompt.remove();
    return GelatoPage.prototype.remove.call(this);
  }
});
