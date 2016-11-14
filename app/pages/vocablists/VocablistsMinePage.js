var GelatoPage = require('gelato/page');
var Table = require('components/vocablists/VocablistsMineTableComponent');
var Sidebar = require('components/vocablists/VocablistsSidebarComponent');

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
