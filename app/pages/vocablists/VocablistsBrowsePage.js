var GelatoPage = require('gelato/page');
var Table = require('components/vocablists/VocablistsBrowseTableComponent');
var Sidebar = require('components/vocablists/VocablistsSidebarComponent');
var ExpiredNotification = require('components/account/AccountExpiredNotificationComponent');

/**
 * A page that allows a user to browse different categories of vocablists they can study.
 * @class VocablistBrowse
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'change input[type="checkbox"]': 'handleChangeCheckbox',
    'keyup #list-search-input': 'handleKeypressListSearchInput',
    'click #list-option': 'handleClickListOption',
    'click #grid-option': 'handleClickGridOption'
  },

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.vocabLists.titleBrowse'),

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsBrowse'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this._views['sidebar'] = new Sidebar();
    this._views['table'] = new Table();
    this._views['expiration'] = new ExpiredNotification();
  },

  /**
   * @method render
   * @returns {VocablistBrowse}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsBrowse.jade');
    }

    this.renderTemplate();
    this._views['sidebar'].setElement('#vocablist-sidebar-container').render();
    this._views['table'].setElement('#vocablist-container').render();
    this._views['expiration'].setElement('#expiration-container').render();

    return this;
  },

  /**
   * @method handleChangeCheckbox
   */
  handleChangeCheckbox: function() {
    /** TODO: support checkbox filters
     var checkedBoxes = $('input[type="checkbox"]:checked');
     var filterTypes = checkedBoxes.map(function(i, el) {
            return $(el).attr('name');
        });
     this.table.setFilterTypes(filterTypes);
     this.table.render();
     **/
  },

  /**
   * @method onClickListOption
   * @param {Event} event
   */
  handleClickListOption: function(event) {
    event.preventDefault();

    this._views['table'].setLayout('list');
    this.$('#list-option').addClass('chosen');
    this.$('#grid-option').removeClass('chosen');
  },

  /**
   * @method onClickGridOption
   * @param {Event} event
   */
  handleClickGridOption: function(event) {
    event.preventDefault();

    this._views['table'].setLayout('grid');
    this.$('#list-option').removeClass('chosen');
    this.$('#grid-option').addClass('chosen');
  },

  /**
   * @method handleKeypressListSearchInput
   * @param {Event} event
   */
  handleKeypressListSearchInput: function(event) {
    this._views['table'].setFilterString(event.target.value);
  }
});
