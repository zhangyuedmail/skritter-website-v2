var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptPartRdng
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;

    // only support pinyin for first go around. Nihongo ga kite imasu!
    this.showReadingPrompt = app.isDevelopment() && app.isChinese();

    this.registerShortcuts = !this.showReadingPrompt;

    this.listenTo(this.prompt.toolbarAction, 'click:correct', this.handlePromptToolbarActionCorrect);
    this.listenTo(this.prompt.toolbarGrading, 'mouseup', this.handlePromptCanvasClick);
  },

  /**
   * @property el
   * @type {String}
   */
  el: '#review-container',

  /**
   * @property events
   * @type Object
   */
  events: {
    'keypress #reading-prompt': 'handleReadingPromptKeypress',
    'click gelato-component': 'handlePromptCanvasClick'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {StudyPromptPartDefn}
   */
  render: function() {
    this.renderTemplate();

    this.prompt.review = this.prompt.reviews.current();
    this.prompt.canvas.grid = false;
    this.prompt.canvas.reset();
    this.prompt.navigation.render();
    this.prompt.shortcuts.tone.stop_listening();
    this.prompt.toolbarAction.buttonCorrect = true;
    this.prompt.toolbarAction.buttonErase = false;
    this.prompt.toolbarAction.buttonShow = false;
    this.prompt.toolbarAction.buttonTeach = false;

    if (this.prompt.review.isComplete()) {
      this.renderComplete();
    } else {
      this.renderIncomplete();
    }

    return this;
  },

  /**
   * Called when attempting to advance to the next prompt via the enter key
   */
  completeReading: function() {
    var vocabReading = this.prompt.review.vocab.get('reading');
    var userReading = this.$('#reading-prompt').val();

    if (!this.showReadingPrompt || this.isCorrect(userReading, vocabReading)) {
      this.prompt.review.set('complete', true);
      this.render();
    } else {
      this.prompt.review.set('score', 1);
      this.prompt.review.set('complete', true);
      this.render();
      this.$('#user-answer').text(userReading).removeClass('hidden');
    }
  },

  /**
   * @method renderComplete
   * @returns {StudyPromptPartRune}
   */
  renderComplete: function() {
    this.prompt.review.stop();
    this.prompt.review.set('complete', true);
    this.prompt.navigation.render();
    this.prompt.shortcuts.grading.listen();
    this.prompt.toolbarAction.render();
    this.prompt.toolbarGrading.render();
    this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
    this.prompt.toolbarVocab.render();
    this.prompt.vocabContained.render();
    this.prompt.vocabDefinition.render();
    this.prompt.vocabMnemonic.render();
    this.prompt.vocabReading.render();
    this.prompt.vocabSentence.render();
    this.prompt.vocabStyle.render();
    this.prompt.vocabWriting.render();

    if (app.user.isAudioEnabled()) {
      this.prompt.reviews.vocab.play();
    }

    this.renderTemplate();

    return this;
  },

  /**
   * @method renderIncomplete
   * @returns {StudyPromptPartRune}
   */
  renderIncomplete: function() {
    this.prompt.review.start();
    this.prompt.review.set('complete', false);
    this.prompt.shortcuts.grading.stop_listening();
    this.prompt.toolbarAction.render();
    this.prompt.toolbarGrading.render();
    this.prompt.toolbarVocab.render();
    this.prompt.vocabContained.render();
    this.prompt.vocabDefinition.render();
    this.prompt.vocabMnemonic.render();
    this.prompt.vocabReading.render();
    this.prompt.vocabSentence.render();
    this.prompt.vocabStyle.render();
    this.prompt.vocabWriting.render();

    this.renderTemplate();

    if (this.showReadingPrompt) {
      this.prompt.shortcuts.unregisterAll();
    }

    return this;
  },

  /**
   * @method handlePromptCanvasClick
   */
  handlePromptCanvasClick: function(e) {
    if (this.prompt.review.isComplete()) {
      this.prompt.next();
    } else {

      // don't advance prompt on incomplete reviews with the text input
      if (this.showReadingPrompt) {
        return;
      }

      // but do advance if there's nothing to type in
      this.prompt.review.set('complete', true);
      this.render();
    }
  },

  /**
   * @method handlePromptToolbarActionCorrect
   */
  handlePromptToolbarActionCorrect: function() {
    this.prompt.review.set('score', this.prompt.review.get('score') === 1 ? 3 : 1);
    this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
    this.prompt.toolbarAction.render();
  },

  /**
   * Given keyboard input, keeps track of the internal actual value and
   * converts the display value to the appropriate alphabet/syllabary
   * (pinyin or kana)
   * @param {jQuery.Event} event a keypress event
   */
  handleReadingPromptKeypress: function(event) {

    // if enter pressed
    if (event.keyCode === 13) {
      this._processPromptSubmit();
    } else {
      this._processPromptInput();
    }
  },

  /**
   * Parses a vocabReading and comparse a userReading to see if it's in the list of approved answers.
   * @param {String} userReading the user's attempted response to a reading prompt
   * @param {String} vocabReading a list of readings, separated by a comma and a space
   * @returns {Boolean} whether the user's reading was found in the parsed list of vocab readings
   */
  isCorrect: function(userReading, vocabReading) {
    vocabReading = vocabReading.split(', ');

    return vocabReading.indexOf(userReading) > -1;
  },

  /**
   *
   * @private
   */
  _processPromptSubmit: function() {
    if (this.prompt.review.isComplete()) {
      this.prompt.review.stop();
      this.prompt.next();
    } else {
      this.completeReading();
    }
  },

  /**
   *
   * @private
   */
  _processPromptInput: function() {
    if (app.isChinese()) {
      // TODO: analyze pinyin
    } else {
      // TODO: analyze kana
    }
  }
});
