const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const StudyToolbarTimerComponent = require('components/study/toolbar/timer/StudyToolbarTimerComponent.js');
const vent = require('vent');

const NavbarMobileStudyComponent = NavbarDefaultComponent.extend({

  events: {
    'click #toggle-menu': 'handleToggleMenuClick',
    'click #add': 'handleAddClick',
    'click #play': 'handlePlayClick',
    'click #info': 'handleInfoClick',
    'click #options': 'handleOptionsClick'
  },

  /**
   * Template to use
   */
  template: require('./NavbarMobileStudy.jade'),

  initialize: function(options) {
    NavbarDefaultComponent.prototype.initialize.apply(this, arguments);
    this._views['timer'] = new StudyToolbarTimerComponent();

    this.listenTo(vent, 'item:added', this.handleItemAdded);
  },

  /**
   *
   * @param event
   */
  handleToggleMenuClick: function(event) {
    event.preventDefault();
    vent.trigger('mobileNavMenu:toggle');
  },

  render: function() {
    NavbarDefaultComponent.prototype.render.apply(this, arguments);

    this._views['timer'].setElement('#timer-container').render();

    return this;
  },

  /**
   * Triggers an event to add an item from the user's lists
   * @method handleAddClick
   * @param {jQuery.ClickEvent} event
   * @triggers item:add
   */
  handleAddClick: function(event) {
    if (this.$('#add').hasClass('adding')) {
      return;
    }

    vent.trigger('item:add');
    this.$('#add').addClass('adding');
  },

  handleItemAdded: function() {
    this.$('#add').removeClass('adding');
  },

  /**
   *
   * @param {jQuery.ClickEvent} event
   * @method handlePlayClick
   */
  handlePlayClick: function(event) {
    vent.trigger('vocab:play');
  },

  /**
   *
   * @param {jQuery.ClickEvent} event
   * @method handleInfoClick
   */
  handleInfoClick: function(event) {
    vent.trigger('studyPromptVocabInfo:show');
  },

  /**
   * Triggers an event to show a study settings popup.
   * @method handleOptionsClick
   * @param {jQuery.ClickEvent} event
   * @triggers studySettings:show
   */
  handleOptionsClick: function(event) {
    vent.trigger('studySettings:show');
  }
});

module.exports = NavbarMobileStudyComponent;
