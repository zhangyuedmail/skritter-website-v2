var Page = require('base/page');
var DefaultNavbar = require('navbars/default/view');
var VocablistTable = require('components/vocablist-published-table/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');

/**
 * @class VocablistPublished
 * @extends {Page}
 */
module.exports = Page.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new VocablistSidebar();
        this.vocablistTable = new VocablistTable();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {},
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Published Lists - Skritter',
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        this.vocablistTable.setElement('#vocablist-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        this.vocablistTable.remove();
        return Page.prototype.remove.call(this);
    }
});
