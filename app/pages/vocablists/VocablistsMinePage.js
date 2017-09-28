const GelatoPage = require('gelato/page');
const Table = require('components/vocablists/VocablistsMineTableComponent');
const DeletedTable = require('components/vocablists/VocablistsDeletedTableComponent');
const Sidebar = require('components/vocablists/VocablistsSidebarComponent');

/**
 * @class VocablistMine
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsMine'),

  navbarOptions: {
    showCreateListBtn: true
  },

  /**
   * @property title
   * @type {String}
   */
  title: 'My Lists - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.sidebar = new Sidebar();
    this.table = new Table();

    // TODO: update desktop templates too
    if (app.isMobile()) {
      this._views['deleted'] = new DeletedTable();
    }
  },

  /**
   * @method render
   * @returns {VocablistBrowse}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsMine.jade');
    }

    this.renderTemplate();
    this.sidebar.setElement('#vocablist-sidebar-container').render();
    this.table.setElement('#vocablist-container').render();

    if (app.isMobile()) {
      this._views['deleted'].setElement('#deleted-container').render();
    }

    return this;
  },

  /**
   * @method remove
   * @returns {VocablistBrowse}
   */
  remove: function() {
    this.sidebar.remove();
    this.table.remove();
    return GelatoPage.prototype.remove.call(this);
  }
});
