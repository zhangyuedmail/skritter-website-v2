define([
], function() {
    /**
     * @class UserSettings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', _.bind(this.cache, this));
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
            filterJapaneseParts: ['defn', 'rdng', 'rune'],
            teachingMode: true
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(skritter.user.id + '-settings', JSON.stringify(this.toJSON()));
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            skritter.api.getUser(skritter.user.id, _.bind(function(result) {
                this.set(result);
                callback();
            }, this));
        },
        /**
         * Returns and sets an array of active parts based on the current language being studied.
         * 
         * @method getActiveParts
         * @returns {Array}
         */
        getActiveParts: function() {
            if (this.isChinese())
                return _.intersection(this.get('filterChineseParts'), this.getEnabledParts());
            return _.intersection(this.get('filterJapaneseParts'), this.getEnabledParts());
        },
        /**
         * Returns the users current avatar and returns it as an image tag using base64 data.
         * 
         * @method getAvatar
         * @param {String} classes
         * @returns {String}
         */
        getAvatar: function(classes) {
            if (classes)
                return "<img src='data:image/png;base64," + this.get('avatar') + "' + class='" + classes + "' />";
            return "<img src='data:image/png;base64," + this.get('avatar') + "' />";
        },
        /**
         * @method getEnabledParts
         * @returns {Array}
         */
        getEnabledParts: function() {
            if (this.isChinese())
                return this.get('chineseStudyParts');
            return this.get('japaneseStudyParts');
        },
        /**
         * @method getFontName
         * @returns {String}
         */
        getFontName: function() {
            if (this.isChinese())
                return 'simkai';
            return 'kaisho';
        },
        /**
         * @method getFontClass
         * @returns {String}
         */
        getFontClass: function() {
            if (this.isChinese())
                return 'chinese-font';
            return 'japanese-font';
        },
        /**
         * Returns the current style which really only applies to Chinese as both,
         * simplified or traditional.
         * 
         * @method getStyle
         * @returns {Array}
         */
        getStyle: function() {
            if (this.isJapanese()) {
                return ['both'];
            } else if (this.isChinese() && this.get('reviewSimplified') && this.get('reviewTraditional')) {
                return ['both', 'simp', 'trad'];
            } else if (this.isChinese() && this.get('reviewSimplified') && !this.get('reviewTraditional')) {
                return ['both', 'simp'];
            } else {
                return ['both', 'trad'];
            }
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
         * @method setActiveParts
         * @param {Array} parts
         * @returns {Array}
         */
        setActiveParts: function(parts) {
            if (this.isChinese()) {
                this.set('filterChineseParts', parts);
                return _.intersection(this.get('filterChineseParts'), this.getEnabledParts());
            }
            this.set('filterJapaneseParts', parts);
            return _.intersection(this.get('filterJapaneseParts'), this.getEnabledParts());
        }
    });
    
    return Settings;
});