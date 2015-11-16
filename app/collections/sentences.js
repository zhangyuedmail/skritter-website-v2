var Collection = require('base/collection');
var Sentence = require('models/sentence');

/**
 * @class Sentences
 * @extends {Collection}
 */
module.exports = Collection.extend({
    /**
     * @property model
     * @type {Sentence}
     */
    model: Sentence
});
