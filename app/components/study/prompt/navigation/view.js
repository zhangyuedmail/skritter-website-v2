var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptNavigation
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.items = null;
    this.showLeft = true;
    this.showRight = true;
  },
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
   * @method render
   * @returns {StudyPromptNavigation}
   */
  render: function() {
    this.renderTemplate();
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
  },
  /**
   * @method setItems
   * @param {Reviews} items
   */
  setItems: function(items) {
    this.stopListening();
    this.listenTo(items.reviews, 'add', this.render);
    this.listenTo(items.reviews, 'state', this.render);
    this.items = items;
    return this.render();
  }
});
