var GelatoPage = require('gelato/page');

var DefaultNavbar = require('navbars/default/view');


/**
 * @class Test
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {},
    /**
     * @property title
     * @type {String}
     */
    title: 'Test - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {AccountSettingsGeneral}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        $.ajax({
            url: 'js/test.js',
            context: this,
            dataType: "script",
            success: this.load
        });
        return this;
    },
    /**
     * @method load
     */
    load: function() {
        mocha.setup('bdd');
        require('test/index');
        mocha.checkLeaks();
        mocha.globals(['gaplugins']);
        mocha.run();
    },
    /**
     * @method remove
     * @returns {AccountSettingsGeneral}
     */
    remove: function() {
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
