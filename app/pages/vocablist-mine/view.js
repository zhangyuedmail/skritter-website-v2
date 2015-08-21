var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-mine-table/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');
var DefaultNavbar = require('navbars/default/view');

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
        this.vocablistTable = new VocablistTable();
        this.navbar = new DefaultNavbar();
        this.sidebar = new VocablistSidebar();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/vocablist-mine/template'),
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
        this.navbar.render();
        this.vocablistTable.setElement('#vocablist-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.vocablistTable.remove();
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
