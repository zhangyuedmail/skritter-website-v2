var GelatoPage = require('gelato/page');
var VocablistAddTable = require('components/vocablist-add-table/view');
var VocablistReviewTable = require('components/vocablist-review-table/view');
var NavbarLoggedIn = require('components/navbar-logged-in/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');

/**
 * @class VocablistQueue
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.addingTable = new VocablistAddTable();
        this.reviewingTable = new VocablistReviewTable();
        this.navbar = new NavbarLoggedIn();
        this.sidebar = new VocablistSidebar();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Queue - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistQueue}
     */
    render: function() {
        this.renderTemplate();
        this.addingTable.setElement('#adding-container').render();
        this.reviewingTable.setElement('#reviewing-container').render();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistQueue}
     */
    remove: function() {
        this.addingTable.remove();
        this.reviewingTable.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
