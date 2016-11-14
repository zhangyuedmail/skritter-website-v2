var GelatoPage = require('gelato/page');
var Table = require('components/vocablists/VocablistsPublishedTableComponent');
var Sidebar = require('components/vocablists/VocablistsSidebarComponent');
var ExpiredNotification = require('components/account/AccountExpiredNotificationComponent');

/**
 * Page that allows a user to search for user-published lists of words and
 * add them to their list.
 * @class VocablistPublished
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * Dictionary of events this view should listen to
   * @type {Object<String, String>}
   */
  events: {
    'keyup #list-search-input': 'handleKeypressListSearchInput',
    'click #clear-search': 'handleClickClearSearch'
  },

  /**
   * Template to render
   * @type {Function}
   */
  template: require('./VocablistsPublished'),

  /**
   * HTML Title of the page
   * @type {String}
   * @default
   */
  title: app.locale('pages.vocabLists.titlePublished'),

  /**
   * Initializes the view. Instantiates subviews.
   * @constructor
   */
  initialize: function() {
    this._views['sidebar'] = new Sidebar();
    this._views['table'] = new Table();
    this._views['expiration'] = new ExpiredNotification();
  },

  /**
   * Renders the view
   * @returns {VocablistBrowse}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsPublished.jade');
    }

    this.renderTemplate();
    this._views['sidebar'].setElement('#vocablist-sidebar-container').render();
    this._views['table'].setElement('#vocablist-container').render();
    this._views['expiration'].setElement('#expiration-container').render();

    return this;
  },

  /**
   * @param {jQuery.Event} e
   * @method handleClickClearSearch
   */
  handleClickClearSearch: function(e) {
    this.$('#clear-search').addClass('hidden');
    this.$('#query-results-text').addClass('invisible');
    this.$('#list-search-input').val('');
    this._views['table'].searchFor('');
  },

  /**
   * Checks to see if the key pressed was "enter". If it was, gets
   * the search value and performs a search.
   * @param {jQuery.Event} event the keyup event
   * @method handleKeypressListSearchInput
   */
  handleKeypressListSearchInput: function(event) {
    if (event.which === 13 || event.keyCode === 13) {
      var needle = ($(event.target).val() || '').trim().toLowerCase().split(' ');
      this._views['table'].searchFor(needle[0]);
      this.$('#clear-search').removeClass('hidden');
      this.updateQueryResultsText(needle);
    }
  },

  /**
   * @param {String[]} needle
   * @method updateQueryResultsText
   */
  updateQueryResultsText: function(needle) {
    var multiWordSearch = (needle.length > 1),
      s = "Showing results for <i>" + needle[0] + "</i>.";

    if (multiWordSearch) {
      s += " Search currently only supports one-word queries, sorry!";
    }

    this.$('#query-results-text').html(s).removeClass('invisible');
  }
});
