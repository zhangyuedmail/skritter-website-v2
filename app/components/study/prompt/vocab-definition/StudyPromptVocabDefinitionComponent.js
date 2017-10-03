const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptVocabDefinitionComponent
 * @extends {GelatoComponent}
 */
const StudyPromptVocabDefinitionComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #show-definition': 'handleClickShowDefinition',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptVocabDefinitionComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.editing = false;
    this.prompt = options.prompt;
    this.visible = false;
  },

  /**
   * @method render
   * @returns {StudyPromptVocabDefinitionComponent}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileStudyPromptVocabDefinitionComponent.jade');
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
   * @method getValue
   * @returns {Object}
   */
  getValue: function() {
    return this.$('textarea').val();
  },

  /**
   * @method handleClickShowDefinition
   * @param {Event} event
   */
  handleClickShowDefinition: function(event) {
    event.preventDefault();

    this.prompt.reviews.showDefinition = true;
    this.prompt.reviews.forEach(function(review) {
      review.set('showDefinition', true);
    });

    this.render();
  },

});

module.exports = StudyPromptVocabDefinitionComponent;
