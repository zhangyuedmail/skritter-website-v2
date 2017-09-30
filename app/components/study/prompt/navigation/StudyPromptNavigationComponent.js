const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptNavigationComponent
 * @extends {GelatoComponent}
 */
const StudyPromptNavigationComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type Object
   */
  events: {
    'click #navigate-next': 'handleClickNavigateNext',
    'click #navigate-previous': 'handleClickNavigatePrevious'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptNavigationComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.showLeft = true;
    this.showRight = true;

    this.$leftArrow = null;
    this.$rightArrow = null;
    this.$component = null;
  },

  /**
   * @method render
   * @returns {StudyPromptNavigationComponent}
   */
  render: function() {
    this.renderTemplate();

    this.$leftArrow = this.$('#navigate-previous');
    this.$rightArrow = this.$('#navigate-next');
    this.$component = this.$('gelato-component');

    this.stopListening();
    this.listenTo(this.prompt.page.items.reviews, 'add', this.update);
    this.listenTo(this.prompt.page.items.reviews, 'state', this.update);

    return this;
  },

  /**
   * Updates view elements based on the current state of the application
   */
  update: function() {
    if (this.prompt.reviews) {
      const shouldShowLeftArrow = this.showLeft &&
        !this.prompt.reviews.isFirst() && this.items.reviews.length &&
        this.prompt.review.isComplete();
      const shouldShowRightArrow = this.showRight && this.prompt.review.isComplete();

      this.$leftArrow.toggleClass('review-complete', shouldShowLeftArrow);
      this.$rightArrow.toggleClass('review-complete', shouldShowRightArrow);
    }

    this.$component.toggleClass('hidden', !this.prompt.reviews);
  },

  /**
   * @method handleClickNavigateNext
   * @param {Event} event
   */
  handleClickNavigateNext: function(event) {
    event.preventDefault();
    this.prompt.next();
  },

  /**
   * @method handleClickNavigatePrevious
   * @param {Event} event
   */
  handleClickNavigatePrevious: function(event) {
    event.preventDefault();
    this.prompt.previous();
  }

});

module.exports = StudyPromptNavigationComponent;
