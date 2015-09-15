var GelatoModel = require('gelato/model');

/**
 * @class PromptReview
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @property character
     * @type {PromptCharacter}
     */
    character: null,
    /**
     * @method defaults
     * @returns {Object}
     */
    defaults: function() {
        return {
            maskReading: true,
            maskWriting: true
        };
    },
    /**
     * @method getPosition
     * @returns {Number}
     */
    getPosition: function() {
        return this.collection.indexOf(this);
    },
    /**
     * @method getTones
     * @returns {Array}
     */
    getTones: function() {
        return this.collection.vocab.getTones()[this.getPosition()];
    }
});