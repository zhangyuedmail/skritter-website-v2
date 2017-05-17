const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabReadingComponent
 * @extends {GelatoComponent}
 */
const StudyPromptVocabReadingComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click .show-reading': 'handleClickShowReading'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptVocabReadingComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.visible = false;
  },

  /**
   * @method render
   * @returns {StudyPromptVocabReadingComponent}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileStudyPromptVocabReadingComponent.jade')
    }

    if (this.prompt.reviews) {
      if (app.isMobile() && _.includes(['defn', 'rdng'], this.prompt.reviews.part)) {
        this.visible = false;
      } else {
        this.visible = true;
      }
    } else {
      this.visible = false;
    }

    this.renderTemplate();

    return this;
  },

  /**
   * @method handleClickShowReading
   * @param {Event} event
   */
  handleClickShowReading: function(event) {
    event.preventDefault();
    var $reading = $(event.target).parent('.reading');
    var position = parseInt($reading.data('position'), 10);
    this.prompt.reviews.at(position).set('showReading', true);
    this.render();
  }

});

module.exports = StudyPromptVocabReadingComponent;
