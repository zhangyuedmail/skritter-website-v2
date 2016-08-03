var GelatoComponent = require('gelato/component');

var Canvas = require('components/study/prompt/canvas/view');
var Navigation = require('components/study/prompt/navigation/view');
var PartDefn = require('components/study/prompt/part-defn/view');
var PartRdng = require('components/study/prompt/part-rdng/view');
var PartRune = require('components/study/prompt/part-rune/view');
var PartTone = require('components/study/prompt/part-tone/view');
var ReviewStatus = require('components/study/prompt/review-status/view');
var Shortcuts = require('components/study/prompt/shortcuts');
var ToolbarAction = require('components/study/prompt/toolbar-action/view');
var ToolbarGrading = require('components/study/prompt/toolbar-grading/view');
var ToolbarVocab = require('components/study/prompt/toolbar-vocab/view');
var Tutorial = require('components/study/prompt/tutorial/view');
var VocabContained = require('components/study/prompt/vocab-contained/view');
var VocabDefinition = require('components/study/prompt/vocab-definition/view');
var VocabMnemonic = require('components/study/prompt/vocab-mnemonic/view');
var VocabReading = require('components/study/prompt/vocab-reading/view');
var VocabSentence = require('components/study/prompt/vocab-sentence/view');
var VocabStyle = require('components/study/prompt/vocab-style/view');
var VocabWriting = require('components/study/prompt/vocab-writing/view');

/**
 * @class StudyPrompt
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    //properties
    this.$inputContainer = null;
    this.$panelLeft = null;
    this.$panelRight = null;
    this.page = options.page;
    this.part = null;
    this.review = null;
    this.reviews = null;

    //components
    this.canvas = new Canvas({prompt: this});
    this.navigation = new Navigation({prompt: this});
    this.reviewStatus = new ReviewStatus({prompt: this});
    this.shortcuts = new Shortcuts({prompt: this});
    this.toolbarAction = new ToolbarAction({prompt: this});
    this.toolbarGrading = new ToolbarGrading({prompt: this});
    this.toolbarVocab = new ToolbarVocab({prompt: this});
    this.tutorial = new Tutorial({prompt: this});
    this.vocabContained = new VocabContained({prompt: this});
    this.vocabDefinition = new VocabDefinition({prompt: this});
    this.vocabMnemonic = new VocabMnemonic({prompt: this});
    this.vocabReading = new VocabReading({prompt: this});
    this.vocabSentence = new VocabSentence({prompt: this});
    this.vocabStyle = new VocabStyle({prompt: this});
    this.vocabWriting = new VocabWriting({prompt: this});
    this.on('resize', this.resize);
  },

  /**
   * @method render
   * @returns {StudyPrompt}
   */
  render: function() {
    this.renderTemplate();

    this.$inputContainer = this.$('#input-container');
    this.$panelLeft = this.$('#panel-left');
    this.$panelRight = this.$('#panel-right');

    this.canvas.setElement('#canvas-container').render();
    this.navigation.setElement('#navigation-container').render();
    this.reviewStatus.setElement('#review-status-container').render();
    this.toolbarAction.setElement('#toolbar-action-container').render();
    this.toolbarGrading.setElement('#toolbar-grading-container').render();
    this.toolbarVocab.setElement('#toolbar-vocab-container').render();
    this.tutorial.setElement('#tutorial-container').render().hide();
    this.vocabContained.setElement('#vocab-contained-container').render();
    this.vocabDefinition.setElement('#vocab-definition-container').render();
    this.vocabMnemonic.setElement('#vocab-mnemonic-container').render();
    this.vocabReading.setElement('#vocab-reading-container').render();
    this.vocabSentence.setElement('#vocab-sentence-container').render();
    this.vocabStyle.setElement('#vocab-style-container').render();
    this.vocabWriting.setElement('#vocab-writing-container').render();

    this.shortcuts.registerAll();
    this.resize();

    return this;
  },

  /**
   * @method renderPart
   * @returns {StudyPrompt}
   */
  renderPart: function() {
    if (this.part) {
      this.part.remove();
    }

    if (this.reviews.isNew()) {
      this.$('#new-ribbon').removeClass('hidden');
    } else {
      this.$('#new-ribbon').addClass('hidden');
    }

    switch (this.reviews.part) {
      case 'defn':
        this.part = new PartDefn({prompt: this}).render();
        break;
      case 'rdng':
        this.part = new PartRdng({prompt: this}).render();
        break;
      case 'rune':
        this.part = new PartRune({prompt: this}).render();
        break;
      case 'tone':
        this.part = new PartTone({prompt: this}).render();
        break;
    }

    // brush dot
    this.$('#canvas-container').toggleClass('rune', this.reviews.part === 'rune');

    this.toolbarVocab.disableEditing();

    return this;
  },

  /**
   * @method getInputSize
   * @returns {Number}
   */
  getInputSize: function() {
    var $content = this.$panelLeft.find('.content');
    if ($content.length) {
      return $content.width();
    } else {
      return 0;
    }
  },

  /**
   * @method isLoaded
   * @returns {Boolean}
   */
  isLoaded: function() {
    return this.reviews ? true : false;
  },

  /**
   * @method next
   * @param {Boolean} [skip]
   */
  next: function(skip) {
    this.review.stop();

    if (skip || this.reviews.isLast()) {
      if (skip) {
        this.reviews.skip = true;
      }
      this.trigger('next', this.reviews);
    } else {
      this.reviews.next();
      this.trigger('reviews:next', this.reviews);
      this.renderPart();
    }
  },

  /**
   * @method previous
   */
  previous: function() {
    this.review.stop();

    if (this.reviews.isFirst()) {
      this.trigger('previous', this.reviews);
    } else {
      this.reviews.previous();
      this.trigger('reviews:previous', this.reviews);
      this.renderPart();
    }
  },

  /**
   * @method remove
   * @returns {StudyPrompt}
   */
  remove: function() {
    this.canvas.remove();
    this.navigation.remove();

    if (this.part) {
      this.part.remove();
    }

    this.reviewStatus.remove();
    this.shortcuts.unregisterAll();
    this.toolbarAction.remove();
    this.toolbarGrading.remove();
    this.toolbarVocab.remove();
    this.tutorial.remove();
    this.vocabContained.remove();
    this.vocabDefinition.remove();
    this.vocabMnemonic.remove();
    this.vocabReading.remove();
    this.vocabSentence.remove();
    this.vocabStyle.remove();
    this.vocabWriting.remove();

    return GelatoComponent.prototype.remove.call(this);
  },

  /**
   * @method reset
   * @returns {StudyPrompt}
   */
  reset: function() {
    this.review = null;
    this.reviews = null;
    this.remove();
    this.render();
    return this;
  },

  /**
   * @method resize
   * @returns {StudyPrompt}
   */
  resize: function() {
    var inputSize = this.getInputSize();
    this.$inputContainer.css({height: inputSize, width: inputSize});
    this.canvas.resize();

    return this;
  },

  /**
   * @method set
   * @param {PromptReviews} reviews
   * @returns {StudyPrompt}
   */
  set: function(reviews) {
    console.info('PROMPT:', reviews);
    this.reviews = reviews;
    this.renderPart();
    this.navigation.render();
    this.reviewStatus.render();

    return this;
  },

  /**
   * @method setSchedule
   * @param {Items} schedule
   * @returns {Prompt}
   */
  setSchedule: function(schedule) {
    this.navigation.setReviews(schedule.reviews);
    this.reviewStatus.setReviews(schedule.reviews);

    return this;
  }

});
