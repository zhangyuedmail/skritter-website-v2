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
     * @method getDefinition
     * @param {Boolean} [ignoreFormat]
     * @returns {String}
     */
    getDefinition: function(ignoreFormat) {
        var definition = this.get('definitions')[app.user.get('sourceLang')];
        if (!definition) {
            definition = this.get('definitions').en;
        }
        return ignoreFormat === false ? definition : app.fn.textToHTML(definition);
    },
    /**
     * @method getWriting
     * @param {String} mask
     * @returns {String}
     */
    getWriting: function(mask) {
        var writing = this.get('writing');
        if (mask !== undefined) {
            writing = writing.replace(mask, mask.split('').map(function() {
                return '_';
            }).join(''));
        }
        return writing.replace(/\s+/g, '');
    }
});
