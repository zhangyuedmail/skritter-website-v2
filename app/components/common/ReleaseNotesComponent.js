const GelatoComponent = require('gelato/component');

/**
 * A component that displays new additions to the app in the current version
 * @class ReleaseNotesComponent
 * @extends {GelatoComponent}
 */
const ReleaseNotesComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .read-more': 'handleReadMoreClicked',
    'click #got-it': 'handleCloseClicked',
  },

  /**
   * Prepares the recipes according to the user's tastes.
   * @method initialize
   */
  initialize: function (options) {
    options = options || {};
    this.dialog = options.dialog;
    this.closeable = options.closeable || false;
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./ReleaseNotes.jade'),

  /**
   * @method render
   * @returns {ReleaseNotesComponent}
   */
  render: function () {
    this.renderTemplate();

    return this;
  },

  /**
   * Triggers the close this view's parent dialog
   * @param event
   */
  handleCloseClicked (event) {
    if (this.dialog) {
      this.dialog.close();
    }
  },

  /**
   * Toggles the amount of text shown in a section explaining an update
   * @param event
   */
  handleReadMoreClicked (event) {
    const section = this.$('#' + $(event.target).data('section'));
    const expanded = section.find('.more').hasClass('hidden');

    section.find('.more').toggleClass('hidden', !expanded);
    section.find('.less').toggleClass('hidden', expanded);
    section.find('.read-more').html(expanded ? '&nbsp; read less' : '&nbsp; read more');
  }
});

module.exports = ReleaseNotesComponent;
