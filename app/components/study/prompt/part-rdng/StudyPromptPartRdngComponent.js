const GelatoComponent = require('gelato/component');
const vent = require('vent');
const config = require('config');

/**
 * @class StudyPromptPartRdngComponent
 * @extends {GelatoComponent}
 */
const StudyPromptPartRdngComponent = GelatoComponent.extend({

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
    'keydown #reading-prompt': 'handleReadingPromptKeydown',
    'input #reading-prompt': 'handleReadingPromptInput',
    'click gelato-component': 'handlePromptCanvasClick'
  },

  /**
   * @property lastInput
   * @type {String}
   */
  lastInput: '',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptPartRdngComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.prompt.review = this.prompt.reviews.current();

    this.userReading =  this.prompt.review.get('userReading') || '';

    // only support pinyin for first go around
    this.showReadingPrompt = app.isChinese() &&
      !app.isMobile() &&
      !app.user.get('disablePinyinReadingPromptInput') &&
      app.user.get('readingChinese') !== 'zhuyin';

    this.registerShortcuts = !this.showReadingPrompt;

    // TODO: get from the user? The abstraction is built in if someday we want to support BoPoMoFo input..
    this.zhInputType = 'pinyin';

    this.listenTo(this.prompt.toolbarAction, 'click:correct', this.handlePromptToolbarActionCorrect);
    this.listenTo(this.prompt.toolbarGrading, 'mouseup', this.handlePromptToolbarGradingMouseup);

    // for testing
    this.listenTo(vent, 'test:processpinyin', () => {
      this.handleReadingPromptInput($.Event('input', {keyCode: 97}));
    });
  },

  /**
   * @method render
   * @returns {StudyPromptPartRdngComponent}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileStudyPromptPartRdngComponent.jade')
    }

    this.renderTemplate();

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
   * @method renderComplete
   * @returns {StudyPromptPartRuneComponent}
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
    this._applyGradeToPromptInput();

    if (this.showReadingPrompt) {
      this.setReadingPromptFocus();
    }

    this.prompt.trigger('reading:complete');

    return this;
  },

  /**
   * @method renderIncomplete
   * @returns {StudyPromptPartRuneComponent}
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
      this.setReadingPromptFocus();
    }

    return this;
  },

  /**
   * Called when attempting to advance to the next prompt via the enter key
   */
  completeReading: function () {
    this._processTextPreCorrection();
    var vocabReading = this.prompt.review.vocab.get('reading');
    var userReading = this.$('#reading-prompt').val();

    this.userReading = userReading;

    this.prompt.review.set('userReading', userReading);
    if (!this.showReadingPrompt || this.isCorrect(userReading, vocabReading)) {
      this.prompt.review.set('complete', true);
      this.prompt.review.set('score', 3);
      this.render();
    } else {
      this.prompt.review.set('score', 1);
      this.prompt.review.set('complete', true);
      this.render();
    }

    if (this.showReadingPrompt) {
      this._applyGradeColoring();
    }

    // TODO: this will cause problems if user submits an answer,
    // then goes back and wants to change it
    if (app.isMobile()) {
      this.prompt.shortcuts.unregisterAll();
    } else {
      this.prompt.shortcuts.registerAll();
    }

  },

  /**
   * @method handlePromptCanvasClick
   */
  handlePromptCanvasClick: function(e) {

    // let's let the user click on the reading prompt, eh?
    if (e.target.id === "reading-prompt") {
      return;
    }

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
   * @method handlePromptToolbarGradingMouseup
   */
  handlePromptToolbarGradingMouseup: function(value) {
    this.prompt.review.set('score', value);

    if (app.user.get('autoAdvancePrompts')) {
      this.prompt.startAutoAdvance();
    }
  },

  /**
   * @method handlePromptToolbarActionCorrect
   */
  handlePromptToolbarActionCorrect: function() {
    this.prompt.review.set('score', this.prompt.review.get('score') === 1 ? 3 : 1);
    this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
    this.prompt.review.set('complete', true);
    this.render();
  },

  /**
   * Handles enter keypress to prevent weird input stuff and double events from firing
   * @param {jQuery.Event} event the keyup event
   */
  handleReadingPromptKeydown: function(event) {
    this.prompt.shortcuts.unregisterAll();
    if (event.keyCode === 13) {
      event.stopPropagation();
      event.preventDefault();
      this._processPromptSubmit();
    }
  },

  /**
   * Given keyboard input, keeps track of the internal actual value and
   * converts the display value to the appropriate alphabet/syllabary
   * (pinyin or kana)
   * @param {jQuery.Event} event a keypress event
   */
  handleReadingPromptInput: function(event) {

    // left and right arrows
    if (event.keyCode === 37 || event.keyCode === 39) {
      if (!this.$('#reading-prompt').val()) {
        // maybe bubble up and go to the previous prompt?
      }

      return;
    }

    // if enter pressed--this is handled before keyup
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
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

  /**
   * Runs the user answer through a Pinyin processor to determine if it is correct.
   * @param {String} userReading the user's attempted response to a reading prompt
   * @param {String} vocabReading a list of readings, separated by a comma and a space
   * @return {Boolean} whether the user's response is correct
   * @method isCorrectZH
   */
  isCorrectZH: function(userReading, vocabReading) {
    let finalAnswer = '';
    let vocabReadings = [];

    if (this.zhInputType === 'pinyin') {
      finalAnswer = this._prepareFinalAnswerPinyin(userReading);
      vocabReadings = vocabReading.split(', ').map(function(r) {
        return app.fn.pinyin.toTone(r)
          .replace(' ... ', '')
          .replace("'", '');
      });
    }

    return vocabReadings.indexOf(finalAnswer) > -1;
  },

  /**
   * Focuses the user's input on the prompt's text input.
   * @methodSetReadingPromptFocus
   */
  setReadingPromptFocus: function() {
    const input = this.$('#reading-prompt');
    const rawInputEl = input[0];
    const textLength = input.val().length;

    input.focus();

    if (rawInputEl.setSelectionRange) {
      rawInputEl.setSelectionRange(textLength, textLength);
    }
  },

  _applyGradeToPromptInput: function() {
    // TODO: a metric (not imperial) crapton of analysis on the userAnswer.
    // Find out what they got wrong and let the user know. Learning!
    if (this.prompt.review.isComplete() && this.showReadingPrompt) {
      var grade = this.prompt.review.get('score');

      // this.$('#reading-prompt').addClass('prompt-grade-' + grade);
      this._applyGradeColoring(grade);
    }
  },

  _applyGradeColoring: function(score) {
    var $answer = this.$('.answer');
    var $promptInput = this.$('#reading-prompt');

    score = score || this.prompt.review.get('score');
    $answer.removeClass('grade-1 grade-2 grade-3 grade-4');
    $answer.addClass("grade-" + score);
    $promptInput.removeClass('grade-1 grade-2 grade-3 grade-4');
    $promptInput.addClass("prompt-grade-" + score);
  },

  /**
   * Handles what happens when the user submits the reading answer based on its completion.
   * @private
   */
  _processPromptSubmit: function() {
    if (this.prompt.review.isComplete()) {

      // if it's already answered but the user changed their previous answer, regrade it
      if (this.showReadingPrompt && this.$('#reading-prompt').val() !== this.userReading) {
        this.completeReading();
      } else {
        this.prompt.review.stop();
        this.prompt.next();
      }
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
    if (app.isChinese()) {
      if (this.zhInputType === 'pinyin') {
        newValue = this._parsePinyinInput(null, event);
      }
    } else {
      // TODO: analyze kana
    }

    this.$('#reading-prompt').val(newValue);
  },

  /**
   * Gets the value from the UI input and mutates it with the necessary
   * modifications to turn it into the proper pinyin representation we want
   * to show.
   * @param {String} input the text to process
   * @param {jQuery.Event} event the original keypress event that changed the input
   * @returns {String} the processed input string
   * @private
   */
  _parsePinyinInput: function(input, event) {
    input = input || this.$('#reading-prompt').val();

    const toProcess = input;
    let output = '';

    if (toProcess.length > this.lastInput.length) {
      output = this._processPinyinAddition(toProcess);
    } else {
      output = this._processPinyinDeletion(toProcess);
    }

    // console.log("lastInput: ", this.lastInput, "original input: ", originalInput, "new input: ", output);
    this.lastInput = output;

    return output;
  },

  /**
   * Processes the text when an additional character has been added.
   * Adds vowel diacritical marks and formatted tone numbers where appropriate.
   * @param {String} input the input string to process
   * @return {string} the input with tone marks and numbers properly added
   * @private
   */
  _processPinyinAddition: function(input) {
    const processed = [];

    // regex helpers
    const toneNumInput = /[1-5]/;
    const toneSubscript = /([₁-₅][1-5]?)/;

    // used to detect if a user is attempting to change an existing tone
    const changeToneNum = /[₁-₅][1-5]/;

    const subMap = {
      '1': '₁',
      '2': '₂',
      '3': '₃',
      '4': '₄',
      '5': '₅'
    };

    const revSubMap = {
      '₁': '1',
      '₂': '2',
      '₃': '3',
      '₄': '4',
      '₅': '5'
    };

    const initials = /(b)|(p)|(m)|(f)|(d)|(t)|(n)|(l)|(r)|(g)|(k)|(h)|(j)|(q)|(x)|(z)|(c)|(s)|(y)|(w)/;

    // input will be split into a format like ["gōng", "₁", "zuo4"]
    input = input.split(toneSubscript);
    // console.log('split input: ', input);
    let wordlike;
    let wordlikeMinusEnd;
    let lastChar;
    let currTone;
    let res;
    let resMinusEnd;
    let lastWordlikeCharIsN;
    let resPotentialNeutral;
    let nextWordlikeIsToneChange;

    // loop through each part and perform the necessary mutations
    for (let i = 0; i < input.length; i++) {

      // setup our data
      wordlike = input[i];
      wordlikeMinusEnd = wordlike.slice(0, -1);
      lastChar = wordlike.slice(wordlike.length - 1, wordlike.length);
      lastWordlikeCharIsN = lastChar === 'n';

      currTone = toneNumInput.exec(wordlike) || [];

      res = app.fn.pinyin.toTone(wordlike.replace(/ü/g, 'v'));
      resMinusEnd = app.fn.pinyin.toTone(wordlikeMinusEnd.replace(/ü/g, 'v') + '5');

      nextWordlikeIsToneChange = i < (input.length - 1) &&
        toneSubscript.test(input[i+1]);

      // check that the input (e.g. ren) could be a valid syllable
      // rather than interpreting it as re5 + n (as an initial)
      resPotentialNeutral = app.fn.pinyin.getData()[wordlike.replace(/ü/g, 'v') + '5'];

      // case 1: mutation for a new complete word that needs to be added e.g. gong1 -> gōng₁ if the conversion matched a pattern
      if (res && res !== wordlike && currTone.length) {
        processed.push(res + subMap[currTone[0]]);
      }

      // case 2: change the tone for an existing word's tone góng₂1 -> gōng₁
      else if ((changeToneNum.exec(wordlike) || []).length) {

        const toChange = input[i-1];
        const newTone = wordlike[1];
        res = app.fn.pinyin.removeToneMarks(toChange);

        // need to replace 'ü' with 'v' before we run it through the converter again
        res = app.fn.pinyin.toTone(res.replace(/ü/g, 'v') + newTone);

        // remove previous, old version of the word e.g góng₂
        processed.pop();

        // push the new version of the word onto the stack e.g. gōng₁
        processed.push(res + subMap[newTone]);
      }

      // case 3: if both the current wordlike and wordlikeMinusEnd are valid words
      // e.g. liàng and liàn, always take the longer version
      else if (i !== input.length - 1 && wordlike && revSubMap[input[i + 1]] &&
        app.fn.pinyin.toTone(app.fn.pinyin.removeToneMarks(wordlike) + revSubMap[input[i + 1]]) ) {

        processed.push(wordlike.replace(/v/g, 'ü'));
      }

      // case 4: add pinyin neutral tone e.g. (typing 有的時候) yǒudes -> yǒude₅s
      else if (wordlikeMinusEnd && resMinusEnd && resMinusEnd !== wordlikeMinusEnd + '5' && initials.test(lastChar) &&
        !resPotentialNeutral && !lastWordlikeCharIsN && !nextWordlikeIsToneChange) {

        processed.push(resMinusEnd + subMap['5']);

        // push the unprocessed last character we chopped off
        processed.push(lastChar);
      }

      // TODO: case n: pinyin was valid word, user added a letter that isn't valid e.g. gōng₁ -> gōnwg₁
      // TODO: case n+1: refactor all this into a state machine or something

      // fallthrough case: no mutations made
      else {
        processed.push(wordlike.replace(/v/g, 'ü'));
      }
    }

    return processed.join('');
  },

  /**
   * Processes the text when a character has been deleted.
   * Removes vowel diacritical marks and formatted tone numbers where appropriate.
   * @param {String} input the input string to process
   * @return {string} the input with tone marks and numbers properly added
   * @private
   */
  _processPinyinDeletion: function(input) {
    var processed = [];

    // regex helpers
    var toneNumInput = /[1-5]/;

    // needs positive lookahead to keep the number in when we split
    var toneSubscript = /([₁-₅][1-5]?)/;

    // used to detect if a user is attempting to change an existing tone
    var isToneSubscript = /[₁-₅]/;

    var subMap = {
      '1': '₁',
      '2': '₂',
      '3': '₃',
      '4': '₄',
      '5': '₅'
    };

    // input will be split into a format like ["gōng", "₁", "zuo4"]
    input = input.split(toneSubscript);
    var wordlike;
    var currTone;
    var res;
    var removedToneVowel;

    for (var i = 0; i < input.length; i++) {
      wordlike = input[i];
      removedToneVowel = app.fn.pinyin.removeToneMarks(wordlike);

      // case 1: user deleted number that was part of a word with a tone e.g. gōng -> gong
      if (removedToneVowel !== wordlike &&
        (i+1 >= input.length || (i+1 < input.length && !isToneSubscript.test(input[i+1])))) {
        processed.push(removedToneVowel);
      }

      // fallthrough case: nothing to change or check
      else {
        processed.push(wordlike);
      }
    }


    return processed.join('');
  },

  /**
   * Modifies the internal representation of the user's answer before
   * submitting it to the correction process. Does not modify the UI,
   * only deals with the value being sent to the corrector.
   * @param {String} answer
   * @returns {String} the modified user's answer
   * @method _prepareFinalAnswerPinyin
   * @private
   */
  _prepareFinalAnswerPinyin: function(answer) {
    var modAnswer = answer;

    // remove tone subscripts
    modAnswer = modAnswer.split(/[₁-₅]/)
      .join('')
      .toLowerCase()
      .replace(' ... ', '');

    return modAnswer;
  },

  /**
   * Analyzes and mutates the value of the reading prompt UI input as
   * a preprocess before being sent through the correction process.
   * Use this when you want to change the actual value of the input the user sees.
   * For internal representation edits, use
   * _prepareFinalAnswerPinyin/_prepareFinalAnswerJA instead.
   * @method _processTextPreCorrection
   * @private
   */
  _processTextPreCorrection: function() {
    var text = this.$('#reading-prompt').val().toLowerCase();

    if (app.isChinese()) {
      if (this.zhInputType === 'pinyin') {
        text = this._processPinyinPreCorrection(text);
      }
    }

    this.$('#reading-prompt').val(text);
  },

  /**
   * Analyzes and mutates the value of some pinyin input as
   * a preprocess before being sent through the correction process.
   * @param {String} input the answer to process
   * @returns {String} the processed pinyin input
   * @method _processPinyinPreCorrection
   * @private
   */
  _processPinyinPreCorrection: function(input) {
    var output = input;
    if (/[a-z]/.test(input.substring(input.length - 1))) {
      // TODO: check that syllable is valid before appending a 5
      var wordlike = input.slice(0, -1);
      if (app.fn.pinyin.toTone(wordlike.replace(/ü/g, 'v') + '5'))
        output = output + '₅';
    }

    return output;
  }

});

module.exports = StudyPromptPartRdngComponent;
