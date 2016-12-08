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
    'click #show-mnemonic': 'handleClickShowMnemonic',
    'click .add-mnemonic': 'handleClickAddMnemonic',
    'click #save': 'handleClickSaveMnemonic'
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
   * @method handleClickAddMnemonic
   * @param {Event} event
   */
  handleClickAddMnemonic: function(event) {
    event.preventDefault();
    console.log($(event.target).data('user'));

    // TODO: save!
  },

  /**
   * @method handleClickSaveMnemonic
   * @param {Event} event
   */
  handleClickSaveMnemonic: function(event) {
    event.preventDefault();
    const mnemonic = this.$('#mnemonic-input').val().trim();

    if (!mnemonic) {
      return;
    }

    // TODO: save!
  },

  /**
   * Renders a list of other user's mnemonics for the current word with the
   * ability for a user to select one.
   */
  renderMnemonicList: function() {
    let listHTML = '';
    this.collection.models.forEach((m) => {
      listHTML += this.listItemTemplate({model: m});
    });

    this.$('#list-area').html(listHTML);
  }

});

module.exports = StudyPromptVocabMnemonicComponent;
