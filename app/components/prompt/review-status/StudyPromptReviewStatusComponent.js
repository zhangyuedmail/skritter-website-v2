const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptReviewStatusComponent
 * @extends {GelatoComponent}
 */
const StudyPromptReviewStatusComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #save-reviews': 'handleClickSaveReviews',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptReviewStatusComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function (options) {
    this.prompt = options.prompt;
  },

  /**
   * @method render
   * @returns {StudyPromptReviewStatusComponent}
   */
  render: function () {
    this.renderTemplate();
    this.stopListening();
    this.listenTo(this.prompt.page.items.reviews, 'add', this.render);
    this.listenTo(this.prompt.page.items.reviews, 'state', this.render);
    return this;
  },

  /**
   * @method handleClickSaveReviews
   * @param {Event} event
   */
  handleClickSaveReviews: function (event) {
    event.preventDefault();
    this.prompt.page.items.reviews.post();
  },

});

module.exports = StudyPromptReviewStatusComponent;
