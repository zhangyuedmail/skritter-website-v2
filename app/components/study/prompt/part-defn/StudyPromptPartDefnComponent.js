const GelatoComponent = require('gelato/component');
const config = require('config');

/**
 * @class StudyPromptPartDefnComponent
 * @extends {GelatoComponent}
 */
const StudyPromptPartDefnComponent = GelatoComponent.extend({

  /**
   * @property el
   * @type {String}
   */
  el: '#review-container',

  /**
   * @property events
   * @type Object
   */
  events: {},

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptPartDefnComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.listenTo(this.prompt.canvas, 'click', this.handlePromptCanvasClick);
    this.listenTo(this.prompt.toolbarAction, 'click:correct', this.handlePromptToolbarActionCorrect);
    this.listenTo(this.prompt.toolbarGrading, 'mouseup', this.handlePromptToolbarGradingMouseup);
  },

  /**
   * @method render
   * @returns {StudyPromptPartDefnComponent}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileStudyPromptPartDefnComponent.jade');
    }

    this.renderTemplate();
    this.prompt.review = this.prompt.reviews.current();
    this.prompt.canvas.grid = false;
    this.prompt.canvas.reset();
    this.prompt.shortcuts.tone.stop_listening();
    this.prompt.toolbarAction.setPromptType('defn');
    if (this.prompt.review.isComplete()) {
      this.renderComplete();
    } else {
      this.renderIncomplete();
    }
    return this;
  },

  /**
   * Whether the keyboard shortcuts should be registered for this prompt
   * @type {Boolean}
   */
  registerShortcuts: true,

  /**
   * @method renderComplete
   * @returns {StudyPromptPartDefnComponent}
   */
  renderComplete: function() {
    this.prompt.review.stop();
    this.prompt.review.set('complete', true);
    this.prompt.navigation.update();
    this.prompt.shortcuts.grading.listen();
    this.prompt.toolbarAction.update();
    this.prompt.toolbarGrading.update(this.prompt.review.get('score'));
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
   * @returns {StudyPromptPartDefnComponent}
   */
  renderIncomplete: function() {
    this.prompt.review.start();
    this.prompt.review.set('complete', false);
    this.prompt.shortcuts.grading.stop_listening();
    this.prompt.toolbarAction.update();

    this.prompt.toolbarGrading.update();
    this.prompt.toolbarVocab.render();
    this.prompt.vocabContained.render();
    this.prompt.vocabDefinition.render();
    this.prompt.vocabMnemonic.render();
    this.prompt.vocabReading.render();
    this.prompt.vocabSentence.render();
    this.prompt.vocabStyle.render();
    this.prompt.vocabWriting.render();
    this.renderTemplate();
    return this;
  },

  /**
   * @method handlePromptCanvasClick
   */
  handlePromptCanvasClick: function() {
    if (this.prompt.review.isComplete()) {
      this.prompt.next();
    } else {
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
    this.prompt.review.set('complete', true);
    this.render();
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

});

module.exports = StudyPromptPartDefnComponent;
