var GelatoCollection = require('gelato/collection');
var Sentence = require('models/sentence');

/**
 * @class Sentences
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
	/**
	 * @property model
	 * @type {Sentence}
	 */
	model: Sentence
});
