/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataVocab
     * @extends GelatoModel
     */
    var DataVocab = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method getCanvasCharacters
         * @returns {Array}
         */
        getCanvasCharacters: function() {
            var characters = [];
            var strokes = this.getStrokes();
            for (var i = 0, length = strokes.length; i < length; i++) {
                var stroke = strokes[i];
                if (stroke) {
                    characters.push(stroke.getCanvasCharacter());
                }
            }
            return characters;
        },
        /**
         * @method getCharacters
         * @returns {Array}
         */
        getCharacters: function() {
            return this.get('writing').split('');
        },
        /**
         * @method getDefinition
         * @param {Boolean} [ignoreFormat]
         * @returns {String}
         */
        getDefinition: function(ignoreFormat) {
            var customDefinition = this.get('customDefinition');
            var definition = this.get('definitions')[app.user.settings.get('sourceLang')];
            if (customDefinition && customDefinition !== '') {
                definition = this.get('customDefinition');
            } else if (definition) {
                definition = this.get('definitions').en;
            }
            return ignoreFormat === false ? definition : app.fn.textToHTML(definition);
        },
        /**
         * @method
         */
        getReading: function() {
            return this.isChinese() ? app.fn.pinyin.toTone(this.get('reading')) : this.get('reading');
        },
        /**
         * @method getStrokes
         * @param {Array}
         */
        getStrokes: function() {
            var strokes = [];
            var characters = this.getCharacters();
            for (var i = 0, length = characters.length; i < length; i++) {
                var stroke = app.user.data.strokes.get(characters[i]);
                if (stroke) {
                    strokes.push(stroke);
                }
            }
            return strokes;
        },
        /**
         * @method getWritingElement
         * @returns {String}
         */
        getWritingElement: function() {
            var element = '';
            var characters = this.getCharacters();
            for (var i = 0, length = characters.length; i < length; i++) {
                var character = characters[i];
                var position = i + 1;
                element += "<div id='writing-position-" + position + "' class='cursor mask'><span>";
                element += character;
                element += "</span></div>";
            }
            return element;
        },
        /**
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            return this.get('lang') === 'zh';
        },
        /**
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            return this.get('lang') === 'ja';
        },
        /**
         * @method play
         * @returns {DataVocab}
         */
        play: function() {
            if (this.has('audioURL')) {
                app.media.play(this.get('audioURL'));
            }
            return this;
        }
    });

    return DataVocab;

});