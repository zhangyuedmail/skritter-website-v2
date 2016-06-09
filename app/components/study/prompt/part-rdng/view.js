var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptPartRdng
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  lastInput: '',

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;

    this.userReading = '';

    // only support pinyin for first go around. Nihongo ga kite imasu!
    this.showReadingPrompt = false; // app.isDevelopment() && app.isChinese();

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
    'keyup #reading-prompt': 'handleReadingPromptKeypress',
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

      // TODO: need to set this better
      this.userReading = userReading;
      this.render();
    } else {
      this.prompt.review.set('score', 1);
      this.prompt.review.set('complete', true);
      this.render();
    }

    if (this.showReadingPrompt) {
      this.$('.answer').addClass("grade-" + this.prompt.review.get('score'))
    }

    // TODO: this will cause problems if user submits an answer,
    // then goes back and wants to change it
    this.prompt.shortcuts.registerAll();
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
      this.$('#reading-prompt').focus();
    }

    return this;
  },

  /**
   * @method handlePromptCanvasClick
   */
  handlePromptCanvasClick: function(e) {
    console.log('testing');
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
      event.preventDefault();
      event.stopPropagation();
      this._processPromptSubmit();
    } else {
      this._processPromptInput(event);
    }
  },

  /**
   * Parses a vocabReading and comparse a userReading to see if it's in the list of approved answers.
   * @param {String} userReading the user's attempted response to a reading prompt
   * @param {String} vocabReading a list of readings, separated by a comma and a space
   * @returns {Boolean} whether the user's reading was found in the parsed list of vocab readings
   */
  isCorrect: function(userReading, vocabReading) {
    if (app.isChinese()) {
      return this.isCorrectZH(userReading, vocabReading);
    } else {
      // TODO
    }
  },

  isCorrectZH: function(userReading, vocabReading) {
    var finalAnswer = this._prepareFinalAnswer(userReading);
    var vocabReadings = vocabReading.split(', ').map(function(r) {
      return app.fn.pinyin.toTone(r);
    });

    return vocabReadings.indexOf(finalAnswer) > -1;
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
   * Processes a non-enter keyboard input event to the reading prompt.
   * Calls the appropriate converter for the language.
   * @private
   */
  _processPromptInput: function(event) {
    var newValue = '';
    if (app.isChinese(event)) {
      newValue = this._parsePinyinInput(null, event);
    } else {
      // TODO: analyze kana
    }

    this.$('#reading-prompt').val(newValue);
  },

  /**
   *
   * @param {String} input the text to process
   * @param {jQuery.Event} event the original keypress event that changed the input
   * @returns {String} the processed input string
   * @private
   */
  _parsePinyinInput: function(input, event) {
    input = input || this.$('#reading-prompt').val();

    var originalInput = input;
    var output = '';

    if (input.length > this.lastInput.length) {
      output = this._processPinyinAddition(input, event);
    } else {
      output = this._processPinyinDeletion(input, event);
    }

    console.log("lastInput: ", this.lastInput, "original input: ", originalInput, "new input: ", output);
    this.lastInput = output;

    return output;
  },

  _processPinyinAddition: function(input, event) {
    var processed = [];

    // regex helpers
    var toneNumInput = /[1-5]/;

    // needs positive lookahead to keep the number in when we split
    var toneSubscript = /([₁-₅][1-5]?)/;

    // used to detect if a user is attempting to change an existing tone
    var changeToneNum = /[₁-₅][1-5]/;

    var subMap = {
      '1': '₁',
      '2': '₂',
      '3': '₃',
      '4': '₄',
      '5': '₅'
    };

    // input will be split into a format like ["gōng", "₁", "zuo4"]
    input = input.split(toneSubscript);

    // loop through each part and perform the necessary mutations
    for (var i = 0; i < input.length; i++) {
      var wordlike = input[i];

      var currTone = toneNumInput.exec(wordlike) || [];
      var res = app.fn.pinyin.toTone(wordlike);

      // if the conversion matched a pattern
      if (res !== wordlike && currTone.length) {
        processed.push(res + subMap[currTone[0]]);
      } else {
        processed.push(wordlike);
      }
    }

    return processed.join('');
  },

  _processPinyinDeletion: function(input, event) {
    // TODO: remove tones, etc. when final is no longer valid

    return input;
  },

  _prepareFinalAnswer: function(answer) {
    if (app.isChinese()) {
      // remove tone subscripts
      return answer.split(/[₁-₅]/).join('').toLowerCase();
    } else {
      // TODO: ja
      return answer;
    }
  }
});
