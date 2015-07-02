var GelatoView = require('gelato/modules/view');

/**
 * @class GelatoComponent
 * @extends {GelatoView}
 */
module.exports = GelatoView.extend({
    /**
     * @property $component
     * @type {jQuery}
     */
    $component: null,
    /**
     * @method renderTemplate
     * @param {String} template
     * @returns {GelatoView}
     */
    renderTemplate: function(template) {
        GelatoView.prototype.renderTemplate.call(this, template);
        this.$component = $(this.$('gelato-component').get(0));
        return this;
    }
});
