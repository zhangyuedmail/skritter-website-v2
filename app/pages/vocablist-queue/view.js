var GelatoPage = require('gelato/page');
var VocablistAddTable = require('components/vocablist-add-table/view');
var VocablistReviewTable = require('components/vocablist-review-table/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');
var DefaultNavbar = require('navbars/default/view');
var Vocablists = require('collections/vocablists');

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
        this.vocablists = new Vocablists();
        this.addingTable = new VocablistAddTable({vocablists: this.vocablists});
        this.reviewingTable = new VocablistReviewTable({vocablists: this.vocablists});
        this.navbar = new DefaultNavbar();
        this.sidebar = new VocablistSidebar();
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
        this.navbar.render();
        this.addingTable.setElement('#adding-container').render();
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
        this.reviewingTable.remove();
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
