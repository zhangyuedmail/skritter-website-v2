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
     * @param {Object} [options]
     * @returns {GelatoView}
     */
    renderTemplate: function(options) {
        GelatoView.prototype.renderTemplate.call(this, options);
        this.$component = $(this.$('gelato-component').get(0));
        return this;
    },
    /**
     * @method hide
     * @returns {GelatoComponent}
     */
    hide: function() {
        this.$component.hide();
        return this;
    },
    /**
     * @method show
     * @returns {GelatoComponent}
     */
    show: function() {
        this.$component.show();
        return this;
    }
});
