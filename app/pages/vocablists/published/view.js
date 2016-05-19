var GelatoPage = require('gelato/page');

var Table = require('components/vocablists/published-table/view');
var Sidebar = require('components/vocablists/sidebar/view');

/**
 * Page that allows a user to search for user-published lists of words and
 * add them to their list.
 * @class VocablistPublished
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * Initializes the view. Instantiates subviews.
   * @constructor
   */
  initialize: function() {
    this.sidebar = new Sidebar();
    this.table = new Table();
  },

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
  template: require('./template'),

  /**
   * HTML Title of the page
   * @type {String}
   * @default
   */
  title: 'Published Lists - Skritter',

  /**
   * Renders the view
   * @returns {VocablistBrowse}
   */
  render: function() {
    this.renderTemplate();
    this.sidebar.setElement('#vocablist-sidebar-container').render();
    this.table.setElement('#vocablist-container').render();

    return this;
  },

  handleClickClearSearch: function(e) {
    this.$('#clear-search').addClass('hidden');
    this.$('#query-results-text').addClass('invisible');
    this.$('#list-search-input').val('');
    this.table.searchFor('');
  },

  /**
   * Checks to see if the key pressed was "enter". If it was, gets
   * the search value and performs a search.
   * @param {jQuery.Event} event the keyup event
   */
  handleKeypressListSearchInput: function(event) {
    if (event.which === 13 || event.keyCode === 13) {
      var needle = ($(event.target).val() || '').trim().toLowerCase().split(' ');
      this.table.searchFor(needle[0]);
      this.$('#clear-search').removeClass('hidden');
      this.updateQueryResultsText(needle);
    }
  },

  /**
   * Destructor that cleans up subviews and events for this view
   * @returns {VocablistBrowse}
   */
  remove: function() {
    this.sidebar.remove();
    this.table.remove();
    
    return GelatoPage.prototype.remove.call(this);
  },

  updateQueryResultsText: function(needle) {

    var multiWordSearch = (needle.length > 1),
      s = "Showing results for <i>" + needle[0] + "</i>.";

    if (multiWordSearch) {
      s += " Search currently only supports one-word queries, sorry!";
    }

    this.$('#query-results-text').html(s).removeClass('invisible');
  }
});
