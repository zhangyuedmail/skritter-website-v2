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
    'click #button-vocab-star': 'handleClickButtonVocabStar',
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
  initialize: function (options) {
    this.dialog = null;
    this.prompt = options.prompt;
  },

  /**
   * @method render
   * @returns {StudyPromptToolbarVocab}
   */
  render: function () {
    this.renderTemplate();

    this.$starBtn = this.$('#button-vocab-star');
    this.$lastStudied = this.$('#item-last-studied');
    this.$vocabInfo = this.$('#button-vocab-info');
    this.$banBtn = this.$('#button-vocab-ban');
    this.$editBtn = this.$('#button-vocab-edit');
    this.$addedFrom = this.$('#item-added-from');
    this.update();

    return this;
  },

  update () {
    const reviews = this.prompt.reviews;
    const item = (reviews && reviews.item) ? reviews.item : null;
    const isStarred = item && reviews.vocab.isStarred();

    this.$starBtn.toggleClass('hidden', !reviews);
    this.$lastStudied.toggleClass('hidden', !item);
    this.$vocabInfo.toggleClass('hidden', !item);
    this.$editBtn.toggleClass('hidden', !item);
    this.$banBtn.toggleClass('hidden', !item);

    if (isStarred) {
      this.$starBtn.removeClass('icon-study-word-star');
      this.$starBtn.addClass('icon-study-word-star-filled');
    } else {
      this.$starBtn.removeClass('icon-study-word-star-filled');
      this.$starBtn.addClass('icon-study-word-star');
    }

    this.$lastStudied.text(this.getLastStudiedValue());
    this.$addedFrom.text(this.getListAddedFrom());
  },

  getLastStudiedValue () {
    const reviews = this.prompt.reviews;
    const item = (reviews && reviews.item) ? reviews.item : null;
    const lastStudied = item ? item.get('last') : null;

    if (lastStudied) {
      const readiness = Math.floor(item.getReadiness() * 100);
      const readinessStr = readiness > 250 ? 'due now' : readiness + '% due';
      return 'studied ' + moment(lastStudied * 1000).fromNow() + ' (' + readinessStr + ')';
    }

    return 'just added (due now)';
  },

  /**
   * Gets the name of the first list this item was added from
   * @returns {string} the name of the list added from
   */
  getListAddedFrom () {
    const reviews = this.prompt.reviews;
    const item = (reviews && reviews.item) ? reviews.item : null;
    const lists = item ? item.get('vocabListIds') : null;

    if (lists && lists.length) {
      const list = this.prompt.page.vocablist || this.prompt.page.vocablists.get(lists[0]);

      if (list) {
        return 'added from ' + list.get('name');
      }
    }

    return '';
  },

  /**
   * @method disableEditing
   * @returns {StudyPromptToolbarVocab}
   */
  disableEditing: function () {
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
  enableEditing: function () {
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
  handleClickButtonVocabAudio: function (event) {
    event.preventDefault();
    vent.trigger('vocab:play');
  },

  /**
   * @method handleClickButtonVocabBan
   * @param {Event} event
   */
  handleClickButtonVocabBan: function (event) {
    let self = this;
    event.preventDefault();
    this.dialog = new ConfirmItemBanDialog({
      item: this.prompt.reviews.item,
      vocab: this.prompt.reviews.vocab,
    });
    this.dialog.once('confirm', function () {
      self.prompt.next(true);
      self.dialog.close();
    });
    this.dialog.open();
  },

  /**
   * @method handleClickButtonVocabEdit
   * @param {Event} event
   */
  handleClickButtonVocabEdit: function (event) {
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
  handleClickButtonVocabInfo: function (event) {
    event.preventDefault();
    vent.trigger('studyPromptVocabInfo:show', this.prompt.reviews.vocab.id);
  },

  /**
   * @method handleClickButtonVocabStar
   * @param {Event} event
   */
  handleClickButtonVocabStar: function (event) {
    event.preventDefault();
    this.prompt.reviews.vocab.toggleStarred();
    this.prompt.reviews.vocab.save();
    this.update();
  },
});
