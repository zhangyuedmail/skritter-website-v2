var GelatoPage = require('gelato/page');
var Prompt = require('components1/study/prompt/view');
var Toolbar = require('components1/study/toolbar/view');
var Navbar = require('navbars/default/view');

/**
 * @class Study
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new Navbar();
        this.prompt = new Prompt();
        this.toolbar = new Toolbar();
    },
    /**
     * @property events
     * @type Object
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
    title: 'Study - Skritter',
    /**
     * @method render
     * @returns {Study}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.prompt.setElement('#study-prompt-container').render();
        this.toolbar.setElement('#study-toolbar-container').render();
        return this;
    },
    /**
     * @method next
     */
    next: function() {},
    /**
     * @method previous
     */
    previous: function() {},
    /**
     * @method remove
     * @returns {Study}
     */
    remove: function() {
        this.navbar.remove();
        this.prompt.remove();
        this.toolbar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
