var GelatoModel = require('gelato/model');
var ReviewData = require('test/models/review-data');

var Review = GelatoModel.extend(/** @lends Review.prototype */ {
	/**
	 * @class Review
	 * @param {Object} [attributes]
	 * @param {Object} [options]
	 * @augments {GelatoModel}
	 */
	initialize: function (attributes, options) {
	},
	/**
	 * @returns {Function|Object}
	 */
	defaults: function () {
		return {
			created: null,
			data: [],
			items: [],
			lang: 'zh',
			part: 'rune',
			position: 0
		};
	},
	/**
	 * @property {String}
	 */
	idAttribute: 'id',
	/**
	 * Get post data for the server.
	 * @returns {Array}
	 */
	getPostData: function () {
		//TODO: generate post data for server
		return [];
	},
	/**
	 * Get prompt data at the current position.
	 * @returns {Object}
	 */
	getPromptData: function () {
		return this.getPromptDataArray()[this.get('position')];
	},
	/**
	 * Get an array of studiable prompt data.
	 * @return {Array}
	 */
	getPromptDataArray: function () {
		switch (this.get('part')) {
			case 'defn':
				return this.get('data').slice(0, 1);
			case 'rdng':
				return this.get('data').slice(0, 1);
			case 'rune':
				return _.filter(
					this.get('data'),
					function (data) {
						return !data.get('filler') && !data.get('root');
					}
				);
			case 'tone':
				return _.filter(
					this.get('data'),
					function (data) {
						return !data.get('filler') && !data.get('root');
					}
				);
		}
	},
	/**
	 * Get the numeric length of the prompt data.
	 * @return {Number}
	 */
	getPromptDataLength: function () {
		return this.getPromptData().length;
	},
	/**
	 * Get an array of data for displaying the reading.
	 * @return {Array}
	 */
	getPromptReadingArray: function () {
		var readings = [];
		var reading = this.vocab.get('reading');
		if (this.isChinese()) {
			if (_.includes(reading, ', ')) {
				readings = reading.match(/[a-z|A-Z]+[1-5]+|'| ... |\s/g);
			} else {
				readings = [reading];
			}
		} else {
			readings = [reading];
		}
		return _.map(
			readings,
			function (value) {
				if (_.includes([' ', ' ... ', '\''], value)) {
					return {type: 'filler', value: value};
				}
				return {type: 'character', value: value};
			}
		);
	},
	/**
	 * Get an array of data for displaying the writing.
	 * @return {Array}
	 */
	getPromptWritingArray: function () {
		return _.filter(
			this.get('data'),
			function (data) {
				return !data.get('root');
			}
		);
	},
	/**
	 * Is it Chinese?
	 * @returns {Boolean}
	 */
	isChinese: function () {
		return this.get('lang') === 'zh';
	},
	/**
	 * Is it complete?
	 * @returns {Boolean}
	 */
	isComplete: function () {
		return this.get('complete');
	},
	/**
	 * Is it Japanese?
	 * @returns {Boolean}
	 */
	isJapanese: function () {
		return this.get('lang') === 'ja';
	},
	/**
	 * Is it the first piece of prompt data?
	 * @returns {Boolean}
	 */
	isFirst: function () {
		return this.get('position') === 0;
	},
	/**
	 * Is it the last piece of prompt data?
	 * @returns {Boolean}
	 */
	isLast: function () {
		return this.get('position') >= this.getPromptDataLength() - 1;
	},
	/**
	 * Load required data for studying the review data.
	 * @returns {Review}
	 */
	load: function () {
		var data = this.get('data');
		for (var a = 0, lengthA = data.length; a < lengthA; a++) {
			var dataReview = new ReviewData(data[a], {review: this});
			dataReview.item = app.user.items.get(dataReview.get('itemId'));
			dataReview.vocab = app.user.items.vocabs.get(dataReview.get('vocabId'));
			switch (this.get('part')) {
				case 'rune':
					dataReview.character = dataReview.vocab.getPromptCharacter();
					break;
				case 'tone':
					dataReview.character = dataReview.vocab.getPromptTones();
					break;
			}
			if (a === 0) {
				this.vocab = dataReview.vocab;
			}
			data[a] = dataReview;
		}
		if (this.isChinese) {
			var writings = this.getPromptWritingArray();
			var readings = this.vocab.getReadingArray();
			for (var b = 0, lengthB = writings.length; b < lengthB; b++) {
				writings[b].set('reading', readings[b]);
			}
		} else {
			data[0].set('reading', this.vocab.get('reading'));
		}
		return this;
	},
	/**
	 * Go to the next piece of prompt data if it exists.
	 * @returns {Object}
	 */
	next: function () {
		if (this.isLast()) {
			return null;
		}
		this.set('position', this.get('position') + 1);
		return this.getPromptData();
	},
	/**
	 * Go to the previous piece of prompt data if it exists.
	 * @returns {Object}
	 */
	previous: function () {
		if (this.isFirst()) {
			return null;
		}
		this.set('position', this.get('position') - 1);
		return this.getPromptData();
	}
});

module.exports = Review;
