const GelatoComponent = require('gelato/component');
const MnemonicCollection = require('collections/MnemonicCollection');

/**
 * @class StudyPromptVocabMnemonicComponent
 * @extends {GelatoComponent}
 */
const StudyPromptVocabMnemonicComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #show-mnemonic': 'handleClickShowMnemonic'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptMnemonicSelectorComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.listItemTemplate = require('./StudyPromptMnemonicListItemComponent.jade');

    this.collection = new MnemonicCollection();
    this.editing = false;
    this.prompt = options.prompt;

    this.listenTo(this.collection, 'state', this.render);
  },

  /**
   * @method render
   * @returns {StudyPromptVocabMnemonicComponent}
   */
  render: function() {
    this.renderTemplate();

    if (this.collection.length) {
      this.renderMnemonicList();
    }

    return this;
  },

  /**
   * @method getValue
   * @returns {Object}
   */
  getValue: function() {
    return {
      creator: app.user.id,
      public: false,
      text: this.$('textarea').val()
    };
  },

  setVocab: function(vocab) {
    this.collection.setVocab(vocab);
    this.collection.fetch({
      success: function(collection, res) {
        console.log(res);
      }
    });
  },

  /**
   * @method handleClickShowMnemonic
   * @param {Event} event
   */
  handleClickShowMnemonic: function(event) {
    event.preventDefault();
    this.prompt.review.set('showMnemonic', true);
    this.render();
  },

  renderMnemonicList: function() {
    let listHTML = '';
    this.collection.models.forEach((m) => {
      listHTML += this.listItemTemplate({model: m});
    });

    this.$('#list-area').html(listHTML);
  }

});

module.exports = StudyPromptVocabMnemonicComponent;
