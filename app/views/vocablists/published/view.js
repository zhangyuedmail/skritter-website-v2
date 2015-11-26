var GelatoPage = require('gelato/page');

var DefaultNavbar = require('navbars/default/view');
var Table = require('./table/view');
var Sidebar = require('../sidebar/view');

/**
 * @class VocablistPublished
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new Sidebar();
        this.table = new Table();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'keyup #list-search-input': 'handleKeypressListSearchInput'
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
    title: 'Published Lists - Skritter',
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        this.table.setElement('#vocablist-container').render();
        return this;
    },
    /**
     * @method handleKeypressListSearchInput
     * @param {Event} event
     */
    handleKeypressListSearchInput: function(event) {
        if (event.which === 13 || event.keyCode === 13) {
            this.table.searchFor($(event.target).val());
        }
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        this.table.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
