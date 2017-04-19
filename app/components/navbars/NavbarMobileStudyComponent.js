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
    this._views['timer'] = new StudyToolbarTimerComponent({
      showIcon: true
    });
    this.page = options.page;

    // todo: fix this
    this.dueCountOffset = 0;

    this.listenTo(vent, 'item:added', this.handleItemAdded);
    this.listenTo(this.page.items, 'update:due-count', this.handleDueCountUpdated);
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

  /**
   * Updates the UI to show the due count
   */
  handleDueCountUpdated: function() {
    this.$('.due-count').text(this.page.items.dueCount);
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
   * Hides any other open menus, then opens the
   * @param {jQuery.ClickEvent} event
   * @method handleInfoClick
   */
  handleInfoClick: function(event) {
    app.hideAllMenus();
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
