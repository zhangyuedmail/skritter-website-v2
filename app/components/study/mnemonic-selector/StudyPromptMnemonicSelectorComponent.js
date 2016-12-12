const GelatoComponent = require('gelato/component');
const MnemonicCollection = require('collections/MnemonicCollection');
const MnemonicModel = require('models/MnemonicModel');

/**
 * @class StudyPromptMnemonicSelectorComponent
 * @extends {GelatoComponent}
 */
const StudyPromptMnemonicSelectorComponent = GelatoComponent.extend({

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

  displayMessage: function(msg, type) {

  },

  freezeInputs: function() {
    this.$('.add-mnemonic').addClass('disabled');
    this.$('#save').addClass('disabled');
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
    const mnemonic = this.$('#custom-mnemonic').val().trim();

    if (!mnemonic || this.$('#save').hasClass('disabled')) {
      return;
    }

    this.freezeInputs();
    this.saveMnemonic(menmonic).then(() => {
      this.unfreezeInputs();
      this.displayMessage(app.locale('pages.study.mnemonicUpdated'));
    });
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
  },

  saveMnemonic: function(menemonic) {
    return new Promise(function(resolve, reject) {
      const model = new MnemonicModel({
        creator: app.user.id,
        public: false,
        text: menemonic
      });
      resolve();
    });
  },

  setVocab: function(vocab) {
    this.collection.setVocab(vocab);
    this.collection.fetch({
      success: function(collection, res) {
        console.log(res);
      }
    });
  },

  unfreezeInputs: function() {

  }
});

module.exports = StudyPromptMnemonicSelectorComponent;
