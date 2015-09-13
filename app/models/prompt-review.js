var GelatoModel = require('gelato/model');

/**
 * @class PromptReview
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @method defaults
     * @returns {Object}
     */
    defaults: function() {
        return {
            maskReading: true,
            maskWriting: true
        };
    }
});