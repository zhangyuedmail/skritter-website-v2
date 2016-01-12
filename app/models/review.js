var SkritterModel = require('base/skritter-model');

/**
 * @class Review
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @method defaults
     * @returns {Object}
     */
    defaults: function() {
        return {
            data: [],
            originals: [],
            prompt: null,
            timeAdded: false,
            timestamp: null
        };
    },
    /**
     * @property idAttribute
     * @type String
     */
    idAttribute: 'id'
});
