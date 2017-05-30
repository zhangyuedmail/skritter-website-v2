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
  },

  /**
   * @method render
   * @returns {StudyPromptNavigationComponent}
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

module.exports = StudyPromptNavigationComponent;
