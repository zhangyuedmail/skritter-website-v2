/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class DataSentence
     */
    var Sentence = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('sentence', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method definition
         * @returns {String}
         */
        getDefinition: function() {
            var definition;
            if (this.get('definitions')[skritter.user.settings.get('sourceLang')]) {
                definition = this.get('definitions')[skritter.user.settings.get('sourceLang')];
            } else if (this.get('definitions').en) {
                definition = this.get('definitions').en;
            }
            return definition;
        },
        /**
         * @method getMaskedWriting
         * @param {Array|String} value
         * @returns {String}
         */
        getMaskedWriting: function(value) {
            var text = '' + this.get('writing');
            value = '' + value;
            var chars = value.split('');
            for (var i = 0, length = chars.length; i < length; i++)
                text = text.replace(new RegExp(chars[i], 'gi'), '__');
            return text.replace(/\s/g, '');
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return skritter.fn.pinyin.toTone(this.get('reading'));
        },
        /**
         * @method getWriting
         * @returns {String}
         */
        getWriting: function() {
            var writing = this.get('writing');
            if (writing) {
                return writing.replace(/\s/g, '');
            }
        }
    });

    return Sentence;
});