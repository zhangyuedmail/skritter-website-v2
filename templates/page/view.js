var GelatoPage = require('gelato/page');


/**
 * @class Pages
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property title
     * @type {String}
     */
    title: '',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Page}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method remove
     * @returns {Page}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
