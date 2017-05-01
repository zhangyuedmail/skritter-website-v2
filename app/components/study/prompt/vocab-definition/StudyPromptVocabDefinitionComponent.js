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
    'click #show-definition': 'handleClickShowDefinition'
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
  },

  /**
   * @method render
   * @returns {StudyPromptVocabDefinitionComponent}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileStudyPromptVocabDefinitionComponent.jade')
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
  }

});

module.exports = StudyPromptVocabDefinitionComponent;
