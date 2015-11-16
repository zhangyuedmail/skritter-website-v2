var View = require('./view');

/**
 * @class Component
 * @extends {View}
 */
module.exports = View.extend({
    /**
     * @method renderTemplate
     * @param {Object} [context]
     * @returns {Component}
     */
    renderTemplate: function(context) {
        return View.prototype.renderTemplate.call(this, context);
    },
    /**
     * @method remove
     * @returns {Component}
     */
    remove: function() {
        return View.prototype.remove.call(this);
    }
});
