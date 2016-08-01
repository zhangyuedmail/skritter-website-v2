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
  },
  /**
   * @property events
   * @type Object
   */
  events: {
    'click #save-reviews': 'handleClickSaveReviews'
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
   * @method handleClickSaveReviews
   * @param {Event} event
   */
  handleClickSaveReviews: function(event) {
    event.preventDefault();
    this.items.reviews.post();
  },
  /**
   * @method setItems
   * @param {Items} items
   */
  setItems: function(items) {
    this.stopListening();
    this.listenTo(items.reviews, 'add', this.render);
    this.listenTo(items.reviews, 'state', this.render);
    this.items = items;
    return this.render();
  }
});
