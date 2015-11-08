var Page = require('base/page');

var AddingTable = require('./adding-table/view');
var DefaultNavbar = require('navbars/default/view');
var ReviewingTable = require('./reviewing-table/view');
var Sidebar = require('../sidebar/view');
var Vocablists = require('collections/vocablists');

/**
 * @class VocablistsQueue
 * @extends {Page}
 */
module.exports = Page.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.vocablists = new Vocablists();
        this.addingTable = new AddingTable({vocablists: this.vocablists});
        this.navbar = new DefaultNavbar();
        this.reviewingTable = new ReviewingTable({vocablists: this.vocablists});
        this.sidebar = new Sidebar();
        this.listenTo(this.vocablists, 'state:standby', function() {
            if (this.vocablists.cursor) {
                this.vocablists.fetch({
                    data: {
                        cursor: this.vocablists.cursor,
                        limit: 10,
                        sort: 'studying',
                        include_percent_done: 'true',
                        lang: app.getLanguage()
                    },
                    remove: false
                });
            }
        });
        this.vocablists.fetch({
            data: {
                limit: 10,
                sort: 'studying',
                include_percent_done: 'true',
                lang: app.getLanguage()
            }
        });
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Queue - Skritter',
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
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
        this.navbar.setElement('#navbar-container').render();
        this.reviewingTable.setElement('#reviewing-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistQueue}
     */
    remove: function() {
        this.addingTable.remove();
        this.navbar.remove();
        this.reviewingTable.remove();
        this.sidebar.remove();
        return Page.prototype.remove.call(this);
    }
});
