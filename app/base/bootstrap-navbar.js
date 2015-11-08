var View = require('./view');

/**
 * @class BootstrapNavbar
 * @extends {View}
 */
module.exports = View.extend({
    /**
     * @property el
     * @type {String}
     */
    el: 'bootstrap-navbars',
    /**
     * @method renderTemplate
     * @param {Object} [context]
     * @returns {BootstrapNavbar}
     */
    renderTemplate: function(context) {
        View.prototype.renderTemplate.call(this, context);
        return this;
    }
});
