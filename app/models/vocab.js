var SkritterModel = require('base/skritter-model');
var NeutralTones = require('data/neutral-tones');
var PromptItems = require('collections/prompt-items');
var PromptItem = require('models/prompt-item');

/**
 * @class Vocab
 * @extends {SkritterModel}
 */
var Vocab = SkritterModel.extend({
	/**
	 * @method initialize
	 * @constructor
	 */
	initialize: function () {
		this.audio = this.has('audio') ? new Audio(this.get('audio').replace('http://', 'https://')) : null;
	},
	/**
	 * @method defaults
	 * @returns {Object}
	 */
	defaults: function () {
		return {
			definitions: {},
			filler: false,
			kana: false,
			vocabIds: []
		};
	},
	/**
	 * @property idAttribute
	 * @type {String}
	 */
	idAttribute: 'id',
	/**
	 * @property urlRoot
	 * @type {String}
	 */
	urlRoot: 'vocabs',
	/**
	 * @method banAll
	 */
	banAll: function () {
		this.set('bannedParts', []);
	},
	/**
	 * @method banPart
	 * @param {String} part
	 */
	banPart: function (part) {
		this.get('bannedParts').push(part);
		this.set('bannedParts', _.uniq(this.get('bannedParts')));
	},
	/**
	 * @method fetchMissing
	 * @param {Function} [callback]
	 */
	fetchMissing: function (callback) {
		$.ajax({
			context: this,
			headers: app.user.session.getHeaders(),
			type: 'POST',
			url: app.getApiUrl() + 'items/addmissing?vocabId=' + this.id,
			error: function (error) {
				typeof callback === 'function' && callback(error);
			},
			success: function () {
				typeof callback === 'function' && callback();
			}
		});
	},
	/**
	 * @method getBase
	 * @returns {String}
	 */
	getBase: function () {
		return this.id.split('-')[1];
	},
	/**
	 * @method getCharacters
	 * @returns {Array}
	 */
	getCharacters: function () {
		return this.get('writing').split('');
	},
	/**
	 * @method getContained
	 * @returns {Array}
	 */
	getContained: function (excludeFillers) {
		var containedVocabs = [];
		var characters = this.getCharacters();
		var lang = this.get('lang');
		for (var i = 0, length = characters.length; i < length; i++) {
			var base = app.fn.mapper.toBase(characters[i], {lang: lang});
			var containedVocab = this.collection.get(base);
			if (!containedVocab) {
				containedVocab = new Vocab({
					id: base,
					filler: true,
					lang: lang,
					writing: characters[i]
				});
				this.collection.add(containedVocab);
			}
			containedVocabs.push(containedVocab);
		}
		if (excludeFillers) {
			return containedVocabs.filter(function (vocab) {
				return !vocab.get('filler');
			});
		}
		return containedVocabs;
	},
	/**
	 * @method getDecomp
	 * @returns {Decomp}
	 */
	getDecomp: function () {
		return this.collection.decomps.get(this.get('writing'));
	},
	/**
	 * @method getDefinition
	 * @param {Boolean} [ignoreFormat]
	 * @returns {String}
	 */
	getDefinition: function (ignoreFormat) {
		var customDefinition = this.get('customDefinition');
		var definition = this.get('definitions')[app.user.get('sourceLang')];
		if (customDefinition && customDefinition !== '') {
			definition = this.get('customDefinition');
		} else if (!definition) {
			definition = this.get('definitions').en;
		}
		return ignoreFormat === false ? definition : app.fn.textToHTML(definition);
	},
	/**
	 * @method getFontClass
	 * @returns {String}
	 */
	getFontClass: function () {
		return this.isChinese() ? 'text-chinese' : 'text-japanese';
	},
	/**
	 * @method getFontName
	 * @returns {String}
	 */
	getFontName: function () {
		return this.isChinese() ? 'KaiTi' : 'DFKaiSho-Md';
	},
	/**
	 * @method getMnemonic
	 * @returns {Object}
	 */
	getMnemonic: function () {
		if (this.get('mnemonic')) {
			return this.get('mnemonic');
		} else if (this.get('topMnemonic')) {
			return this.get('topMnemonic');
		}
		return null;
	},
	/**
	 * @method getPromptCharacters
	 * @returns {Array}
	 */
	getPromptCharacters: function () {
		var characters = [];
		var strokes = this.getStrokes();
		for (var i = 0, length = strokes.length; i < length; i++) {
			var stroke = strokes[i];
			if (stroke) {
				characters.push(strokes[i].getPromptCharacter());
			} else {
				characters.push(null);
			}
		}
		return characters;
	},
	/**
	 * @method getPromptItems
	 * @param {String} part
	 * @returns {PromptItems}
	 */
	getPromptItems: function (part) {
		var promptItems = new PromptItems();
		var containedVocabs = this.getContained();
		var characters = [];
		var now = Date.now();
		var vocab = this;
		var vocabs = [];
		switch (part) {
			case 'rune':
				characters = vocab.getPromptCharacters();
				vocabs = containedVocabs.length ? containedVocabs : [vocab];
				break;
			case 'tone':
				characters = vocab.getPromptTones();
				vocabs = containedVocabs.length ? containedVocabs : [vocab];
				break;
			default:
				vocabs = [vocab];
		}
		for (var i = 0, length = vocabs.length; i < length; i++) {
			var childVocab = vocabs[i];
			var promptItem = new PromptItem();
			promptItem.character = characters[i];
			promptItem.vocab = childVocab;
			promptItem.set('filler', childVocab.isFiller());
			promptItem.set('kana', childVocab.isKana());
			promptItems.add(promptItem);
		}
		promptItems.group = now + '_' + this.id;
		promptItems.part = part;
		promptItems.vocab = vocab;
		return promptItems;
	},
	/**
	 * @method getPromptTones
	 * @returns {Array}
	 */
	getPromptTones: function () {
		var tones = [];
		var strokes = this.getCharacters();
		for (var i = 0, length = strokes.length; i < length; i++) {
			tones.push(this.collection.strokes.getPromptTones());
		}
		return tones;
	},
	/**
	 * @method getReading
	 * @returns {String}
	 */
	getReading: function () {
		//TODO: depreciate this for direct usage in templates
		return this.isChinese() ? app.fn.pinyin.toTone(this.get('reading')) : this.get('reading');
	},
	/**
	 * @method getReadingObjects
	 * @returns {Array}
	 */
	getReadingObjects: function () {
		var readings = [];
		var reading = this.get('reading');
		if (this.isChinese()) {
			if (reading.indexOf(', ') === -1) {
				readings = reading.match(/[a-z|A-Z]+[1-5]+|'| ... |\s/g);
			} else {
				readings = [reading];
			}
		} else {
			readings = [reading];
		}
		return readings.map(function (value) {
			if ([' ', ' ... ', '\''].indexOf(value) > -1) {
				return {type: 'filler', value: value};
			}
			return {type: 'character', value: value};
		});
	},
	/**
	 * @method getSentence
	 * @returns {Sentence}
	 */
	getSentence: function () {
		return this.collection.sentences.get(this.get('sentenceId'));
	},
	/**
	 * @method getStrokes
	 * @returns {Array}
	 */
	getStrokes: function () {
		var strokes = [];
		var characters = this.getCharacters();
		for (var i = 0, length = characters.length; i < length; i++) {
			var stroke = this.collection.strokes.get(characters[i]);
			if (stroke) {
				if (this.isJapanese()) {
					if (!app.user.get('studyKana') && stroke.isKana()) {
						strokes.push(null);
					} else {
						strokes.push(stroke);
					}
				} else {
					strokes.push(stroke);
				}
			} else {
				strokes.push(null);
			}
		}
		return strokes;
	},
	/**
	 * @method getTones
	 * @returns {Array}
	 */
	getTones: function () {
		if (this.isChinese()) {
			var tones = [];
			var contained = this.get('containedVocabIds') ? this.getContained() : [this];
			var readings = this.get('reading').split(', ');
			for (var a = 0, lengthA = readings.length; a < lengthA; a++) {
				var reading = readings[a].match(/[1-5]+/g);
				for (var b = 0, lengthB = reading.length; b < lengthB; b++) {
					var tone = parseInt(reading[b], 10);
					var containedWriting = contained[b].get('writing');
					var wordWriting = this.get('writing');
					tones[b] = Array.isArray(tones[b]) ? tones[b].concat(tone) : [tone];
					//TODO: make tests to verify neutral tone wimps
					if (NeutralTones.isWimp(containedWriting, wordWriting, b)) {
						tones[b] = tones[b].concat(contained[b].getTones()[0]);
					}
				}
			}
			return tones;
		}
		return [];
	},
	/**
	 * @method getVariation
	 * @returns {Number}
	 */
	getVariation: function () {
		return parseInt(this.id.split('-')[2], 10);
	},
	/**
	 * @method getWriting
	 * @returns {String}
	 */
	getWriting: function () {
		return this.get('writing');
	},
	/**
	 * @method getWritingDifference
	 * @param {String} vocabId
	 * @returns {String}
	 */
	getWritingDifference: function (vocabId) {
		return _.zipWith(
			this.get('writing').split(),
			app.fn.mapper.fromBase(vocabId).split(),
			function (thisChar, otherChar) {
				return thisChar === otherChar ? '-' : otherChar;
			}).join('');
	},
	/**
	 * @method isBanned
	 * @returns {Boolean}
	 */
	isBanned: function () {
		return this.get('bannedParts').length ? true : false;
	},
	/**
	 * @method isChinese
	 * @returns {Boolean}
	 */
	isChinese: function () {
		return this.get('lang') === 'zh';
	},
	/**
	 * @method isFiller
	 * @returns {Boolean}
	 */
	isFiller: function () {
		if (app.isJapanese()) {
			if (!app.user.get('studyKana') && this.isKana()) {
				return true;
			}
		}
		return _.includes(['~', '-', '～', 'ー', '.', '。', ',', '，', '、', '・'], this.get('writing'));
	},
	/**
	 * @method isJapanese
	 * @returns {Boolean}
	 */
	isJapanese: function () {
		return this.get('lang') === 'ja';
	},
	/**
	 * @method isKana
	 * @returns {Boolean}
	 */
	isKana: function () {
		return app.fn.isKana(this.get('writing'));
	},
	/**
	 * @method isStarred
	 * @returns {Boolean}
	 */
	isStarred: function () {
		return this.get('starred');
	},
	/**
	 * @method parse
	 * @param {Object} response
	 * @returns {Object}
	 */
	parse: function (response) {
		return response.Vocab || response;
	},
	/**
	 * @method play
	 * @returns {Audio}
	 */
	play: function () {
		if (this.audio && this.audio.paused) {
			this.audio.play();
		}
		return this.audio;
	},
	/**
	 * @method post
	 * @param {Function} callback
	 */
	post: function (callback) {
		$.ajax({
			context: this,
			url: app.getApiUrl() + 'vocabs',
			type: 'POST',
			headers: app.user.session.getHeaders(),
			data: {
				id: this.id,
				definitions: JSON.stringify(this.get('definitions')),
				lang: app.getLanguage(),
				reading: this.get('reading'),
				traditionalWriting: this.get('writingTraditional'),
				writing: this.get('writing')
			},
			error: function (error) {
				typeof callback === 'function' && callback(error);
			},
			success: function (result) {
				typeof callback === 'function' && callback(null, this.set(result.Vocab, {merge: true}));
			}
		});
	},
	/**
	 * @method toggleStarred
	 * @returns {Boolean}
	 */
	toggleStarred: function () {
		if (this.get('starred')) {
			this.set('starred', false);
			return false;
		}
		this.set('starred', true);
		return true;
	},
	/**
	 * @method unbanAll
	 */
	unbanAll: function () {
		this.set('bannedParts', []);
	},
	/**
	 * @method unbanPart
	 * @param {String} part
	 */
	unbanPart: function (part) {
		this.set('bannedParts', _.remove(this.get('bannedParts'), part));
	}
});

module.exports = Vocab;
