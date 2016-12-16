const GelatoComponent = require('gelato/component');
const MnemonicCollection = require('collections/MnemonicCollection');
const MnemonicModel = require('models/MnemonicModel');
const vent = require('vent');

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
    'click #save': 'handleClickSaveMnemonic',
    'click #remove-mnem': 'handleClickRemoveMnemonic',
    'keydown #custom-mnemonic': 'handleKeydown'
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
   * Shows a message to the user
   * @param {String} msg the message to the user
   * @param {String} [type] class to add to the message box
   */
  displayMessage: function(msg, type) {
    this.$('#user-message').text(msg)
      .removeClass('hidden alert-success alert-danger alert-warning')
      .addClass(type || 'alert-success');
  },

  /**
   * Prevents custom mnemonic input keydowns from being handled by prompt shortcuts.
   * @param {jQuery.Event} e the keydown event to stop from propagating
   * @method handleKeydown
   */
  handleKeydown: function(e) {
    e.stopPropagation();
  },

  /**
   *
   * @returns {string}
   */
  getCurrentMnemonicText: function() {
    if (this.collection.vocab && this.collection.vocab.get('mnemonic')) {
      return this.collection.vocab.get('mnemonic').text;
    }

    return '';
  },

  /**
   * @method getValue
   * @returns {Object}
   * @method getValue
   */
  getValue: function() {
    return {
      creator: app.user.id,
      public: false,
      text: this.$('textarea').val()
    };
  },

  /**
   * Handles action when user wants to add a public mnemonic authored by another user.
   * @method handleClickAddMnemonic
   * @param {Event} event
   * @method handleClickAddMnemonic
   */
  handleClickAddMnemonic: function(event) {
    event.preventDefault();
    const btn = $(event.target);
    const id = btn.data('user');

    if (btn.hasClass('disabled')) {
      return;
    }

    const mnemonic = this.collection.get(id);

    this._disableInputs();
    this.saveMnemonic(mnemonic.get('writing'), mnemonic.get('author'), true).then(() => {
      this.render();
      this.displayMessage(app.locale('pages.study.mnemonicUpdated'));
      vent.trigger('mnemonic:updated', mnemonic);
    });
  },

  handleClickRemoveMnemonic: function(event) {
    event.preventDefault();
    this._disableInputs();
    this.saveMnemonic('').then(() => {
      this.render();
      vent.trigger('mnemonic:updated', null);
    });
  },

  /**
   * Saves the user mnemonic and disables other inputs while that process
   * is happening.
   * @method handleClickSaveMnemonic
   * @param {jQuery.Event} event click event
   */
  handleClickSaveMnemonic: function(event) {
    event.preventDefault();
    const mnemonic = this.$('#custom-mnemonic').val().trim();

    if (!mnemonic || this.$('#save').hasClass('disabled')) {
      return;
    }

    this.$('#user-message').addClass('hidden');
    this._disableInputs();

    this.saveMnemonic(mnemonic).then(() => {
      this._enableInputs();
      this.displayMessage(app.locale('pages.study.mnemonicUpdated'));
      vent.trigger('mnemonic:updated', mnemonic);
    });
  },

  /**
   * Renders a list of other user's mnemonics for the current word with the
   * ability for a user to select one.
   */
  renderMnemonicList: function() {
    let listHTML = '';
    const vocab = this.collection.vocab;
    this.collection.models.forEach((m) => {

      // don't list the currenly selected mnemonic.
      if (m.isCurrentForVocab(vocab)) {
        return;
      }

      listHTML += this.listItemTemplate({
        vocab: this.collection.vocab,
        model: m
      });
    });

    this.$('#list-area').html(listHTML);
  },

  /**
   * Saves a custom mnemonic
   * @param {String} mnemonic new mnemonic text
   * @param {String} [creator] the author of the mnemonic
   * @param {Boolean} [isPublic] whether the mnemonic is public
   * @returns {Promise} resolves when the vocab has been updated with the new definition
   */
  saveMnemonic: function(mnemonic, creator, isPublic) {
    return new Promise((resolve, reject) => {
      this.collection.vocab.save({mnemonic: {
        creator: creator || app.user.id,
        public: isPublic || false,
        text: mnemonic
      }}, {
        success: function() {
          resolve();
        },
        error: function() {
          reject();
        }
      });
    });
  },

  /**
   * Sets the current vocab to set the menmonic for
   * @param {VocabModel} vocab the current vocab
   */
  setVocab: function(vocab) {
    this.collection.setVocab(vocab);
    this.collection.fetch({
      success: function(collection, res) {
        console.log(res);
      }
    });
  },

  /**
   * Enables UI inputs
   * @private
   */
  _enableInputs: function() {
    this.$('#remove-mnem').removeClass('disabled');
    this.$('.add-mnemonic').removeClass('disabled');
    this.$('#save').removeClass('disabled');
    this.$('#custom-mnemonic').prop('disabled', false);
  },

  /**
   * Disables UI inputs
   * @private
   */
  _disableInputs: function() {
    this.$('#remove-mnem').addClass('disabled');
    this.$('.add-mnemonic').addClass('disabled');
    this.$('#save').addClass('disabled');
    this.$('#custom-mnemonic').prop('disabled', true);
  },
});

module.exports = StudyPromptMnemonicSelectorComponent;
