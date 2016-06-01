var GelatoPage = require('gelato/page');

var Table = require('components/vocablists/mine-table/view');
var Sidebar = require('components/vocablists/sidebar/view');

/**
 * @class VocablistMine
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.sidebar = new Sidebar();
    this.table = new Table();
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @property title
   * @type {String}
   */
  title: 'My Lists - Skritter',

  /**
   * @method render
   * @returns {VocablistBrowse}
   */
  render: function() {
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
