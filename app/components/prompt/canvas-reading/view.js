var GelatoComponent = require('gelato/component');

/**
 * @class PromptCanvasReading
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.prompt = options.prompt;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptCanvasReading}
     */
    render: function() {
        this.renderTemplate();
        return this;
    }
});
