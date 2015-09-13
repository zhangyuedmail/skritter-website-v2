var GelatoModel = require('gelato/model');

/**
 * @class Sentence
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
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
