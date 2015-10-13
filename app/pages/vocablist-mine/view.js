var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-mine-table/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');

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
        this.navbar = this.createComponent('navbars/default');
        this.sidebar = new VocablistSidebar();
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
    title: 'My Lists - Skritter',
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
        return GelatoPage.prototype.remove.call(this);
    }
});
