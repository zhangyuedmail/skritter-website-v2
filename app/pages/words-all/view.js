var GelatoPage = require('gelato/page');
var WordsSidebar = require('components/words-sidebar/view');
var DefaultNavbar = require('navbars/default/view');

/**
 * @class VocablistBrowse
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new WordsSidebar();
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
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'All Words - Skritter',
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
        this.navbar.render();
        this.sidebar.setElement('#words-sidebar-container').render();
        return this;
    },
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
