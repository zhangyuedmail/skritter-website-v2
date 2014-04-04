/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class UserSettings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //stores user settings to localStorage as they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            audio: true,
            autoSync: true,
            autoSyncThreshold: 10,
            hideDueCount: false,
            hideTimer: false,
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune']
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            localStorage.setItem(event.id + '-settings', JSON.stringify(event.toJSON()));
        },
        /**
         * Returns and sets an array of active parts based on the current language being studied.
         * 
         * @method activeParts
         * @param {Array} parts
         * @returns {Array}
         */
        activeParts: function(parts) {
            if (parts)
                if (this.isChinese()) {
                    this.set('filterChineseParts', parts);
                } else {
                    this.set('filterJapaneseParts', parts);
                }
            if (this.isChinese())
                return _.intersection(this.get('filterChineseParts'), this.enabledParts());
            return _.intersection(this.get('filterJapaneseParts'), this.enabledParts());
        },
        /**
         * Returns the users current avatar and returns it as an image tag using base64 data.
         * 
         * @method avatar
         * @param {String} classes
         * @returns {Image} Returns a base64 image tag
         */
        avatar: function(classes) {
            if (classes)
                return "<img src='data:image/png;base64," + this.get('avatar') + "' + class='" + classes + "' />";
            return "<img src='data:image/png;base64," + this.get('avatar') + "' />";
        },
        /**
         * @method enabledParts
         * @returns {Array}
         */
        enabledParts: function() {
            if (this.isChinese())
                return this.get('chineseStudyParts');
            return this.get('japaneseStudyParts');
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            var self = this;
            skritter.api.getUser(this.get('id'), function(result) {
                self.set(result);
                callback();
            });
        },
        /**
         * @method font
         * @returns {String}
         */
        font: function() {
            if (this.isChinese())
                return 'simkai';
            return 'kaisho';
        },
        /**
         * @method fontClass
         * @returns {String}
         */
        fontClass: function() {
            if (this.isChinese())
                return 'chinese-font';
            return 'japanese-font';
        },
        /**
         * Returns true if the target language is set to Chinese.
         * 
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            if (this.get('targetLang') === 'zh')
                return true;
            return false;
        },
        /**
         * Returns true if the target language is set to Japanese.
         * 
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            if (this.get('targetLang') === 'ja')
                return true;
            return false;
        },
        /**
         * Returns the current style which really only applies to Chinese as both,
         * simplified or traditional.
         * 
         * @method style
         * @returns {Array}
         */
        style: function() {
            if (this.isJapanese()) {
                return null;
            } else if (this.isChinese() && this.get('reviewSimplified') && this.get('reviewTraditional')) {
                return ['both', 'simp', 'trad'];
            } else if (this.isChinese() && this.get('reviewSimplified') && !this.get('reviewTraditional')) {
                return ['both', 'simp'];
            } else {
                return ['both', 'trad'];
            }
        }
    });
    
    return Settings;
});