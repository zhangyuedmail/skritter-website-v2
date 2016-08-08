var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptNavigation
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({

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
  template: require('./template'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.showLeft = true;
    this.showRight = true;
  },

  /**
   * @method render
   * @returns {StudyPromptNavigation}
   */
  render: function() {
    this.renderTemplate();
    this.stopListening();
    this.listenTo(this.prompt.page.items.reviews, 'add', this.render);
    this.listenTo(this.prompt.page.items.reviews, 'state', this.render);
    return this;
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
