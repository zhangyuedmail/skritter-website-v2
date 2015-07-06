var GelatoModel = require('gelato/modules/model');

/**
 * @class DataSentence
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property idAttribute
     * @type String
     */
    idAttribute: 'id',
    /**
     * @method getWriting
     * @returns {String}
     */
    getWriting: function() {
        return this.get('writing').replace(/\s+/g, '');
    }
});
