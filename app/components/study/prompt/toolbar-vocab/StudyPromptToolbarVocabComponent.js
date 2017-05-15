const GelatoComponent = require('gelato/component');
const ConfirmItemBanDialog = require('dialogs1/confirm-item-ban/view');
const vent = require('vent');

/**
 * @class StudyPromptToolbarVocab
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #button-vocab-audio': 'handleClickButtonVocabAudio',
    'click #button-vocab-ban': 'handleClickButtonVocabBan',
    'click #button-vocab-edit': 'handleClickButtonVocabEdit',
    'click #button-vocab-info': 'handleClickButtonVocabInfo',
    'click #button-vocab-star': 'handleClickButtonVocabStar'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptToolbarVocabComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.dialog = null;
    this.prompt = options.prompt;
  },

  /**
   * @method render
   * @returns {StudyPromptToolbarVocab}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method disableEditing
   * @returns {StudyPromptToolbarVocab}
   */
  disableEditing: function() {
    this.prompt.editing = false;
    this.prompt.vocabDefinition.editing = false;
    this.prompt.vocabMnemonic.editing = false;
    if (this.prompt.part.registerShortcuts) {
      if (app.isMobile()) {
        this.prompt.shortcuts.unregisterAll();
      } else {
        this.prompt.shortcuts.registerAll();
      }
    }
    this.prompt.review.set('showMnemonic', false);
    this.prompt.vocabDefinition.render();
    this.prompt.vocabMnemonic.render();
    return this;
  },

  /**
   * @method enableEditing
   * @returns {StudyPromptToolbarVocab}
   */
  enableEditing: function() {
    this.prompt.editing = true;
    this.prompt.vocabDefinition.editing = true;
    this.prompt.shortcuts.unregisterAll();
    this.prompt.vocabDefinition.render();

    return this;
  },

  /**
   * @method handleClickButtonVocabAudio
   * @param {Event} event
   */
  handleClickButtonVocabAudio: function(event) {
    event.preventDefault();
    vent.trigger('vocab:play');
  },

  /**
   * @method handleClickButtonVocabBan
   * @param {Event} event
   */
  handleClickButtonVocabBan: function(event) {
    var self = this;
    event.preventDefault();
    this.dialog = new ConfirmItemBanDialog({
      item: this.prompt.reviews.item,
      vocab: this.prompt.reviews.vocab
    });
    this.dialog.once('confirm', function() {
      self.prompt.next(true);
      self.dialog.close();
    });
    this.dialog.open();
  },

  /**
   * @method handleClickButtonVocabEdit
   * @param {Event} event
   */
  handleClickButtonVocabEdit: function(event) {
    event.preventDefault();
    if (this.prompt.editing) {
      this.prompt.reviews.vocab.set('customDefinition', this.prompt.vocabDefinition.getValue());
      this.disableEditing();
      this.prompt.reviews.vocab.save();
    } else {
      this.enableEditing();
    }

    this.$('#button-vocab-edit').toggleClass('active', this.prompt.editing);
  },

  /**
   * @method handleClickButtonVocabInfo
   * @param {Event} event
   */
  handleClickButtonVocabInfo: function(event) {
    event.preventDefault();
    vent.trigger('studyPromptVocabInfo:show', this.prompt.reviews.vocab.id);
  },

  /**
   * @method handleClickButtonVocabStar
   * @param {Event} event
   */
  handleClickButtonVocabStar: function(event) {
    event.preventDefault();
    this.prompt.reviews.vocab.toggleStarred();
    this.prompt.reviews.vocab.save();
    this.render();
  }
});
