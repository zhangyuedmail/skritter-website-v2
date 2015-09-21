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
          data: []
        };
    },
    /**
     * @property idAttribute
     * @type String
     */
    idAttribute: 'id'
});
