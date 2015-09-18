var GelatoPage = require('gelato/page');

/**
 * @class NotFound
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    events: {
        'vclick #toggle-nav': function() {
            $('gelato-application').toggleClass('show-nav');
        }
    },
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Not Found - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {NotFound}
     */
    render: function() {
        this.renderTemplate();
        return this;
    }
});
