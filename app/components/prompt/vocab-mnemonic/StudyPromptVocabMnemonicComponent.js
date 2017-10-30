const GelatoComponent = require('gelato/component');
const ViewDialog = require('dialogs1/view-dialog/view');
const MnemonicSelector = require('components/study/mnemonic-selector/StudyPromptMnemonicSelectorComponent.js');
const vent = require('vent');

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
    'click #add-mnemonic': 'handleClickAddMnemonic',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptVocabMnemonicComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function (options) {
    this.editing = false;
    this.prompt = options.prompt;

    this._views['selector'] = new ViewDialog({
      showCloseButton: true,
      showTitle: true,
      dialogTitle: app.locale('pages.study.menmonicSelectorDialogTitle'),
      content: MnemonicSelector,
    });

    this.listenTo(vent, 'mnemonic:updated', this.render);
  },

  /**
   * @method render
   * @returns {StudyPromptVocabMnemonicComponent}
   */
  render: function () {
    this.renderTemplate();

    return this;
  },

  /**
   * @method getValue
   * @returns {Object}
   */
  getValue: function () {
    return {
      creator: app.user.id,
      public: false,
      text: this.$('textarea').val(),
    };
  },

  /**
   * @method handleClickShowMnemonic
   * @param {Event} event
   */
  handleClickShowMnemonic: function (event) {
    event.preventDefault();
    this.reveal();
  },

  /**
   * Opens a popup that allows a user to add a mnemonic for a word
   */
  handleClickAddMnemonic: function () {
    this._views['selector'].content.setVocab(this.prompt.reviews.vocab);
    this._views['selector'].open();
  },

  /**
   * @method reveal
   */
  reveal: function () {
    this.prompt.review.set('showMnemonic', true);
    this.render();
  },

});

module.exports = StudyPromptVocabMnemonicComponent;
