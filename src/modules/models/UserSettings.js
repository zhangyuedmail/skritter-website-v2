/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class UserSettings
     * @extends GelatoModel
     */
    var UserSettings = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.user = options.user;
            this.on('change', this.save);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            allChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            allJapaneseParts: ['defn', 'rdng', 'rune'],
            gradingColors: {1: '#e74c3c', 2: '#ebbd3e', 3: '#87a64b', 4: '#4d88e3'}
        },
        /**
         * @method cache
         * @returns {UserSettings}
         */
        cache: function() {
            localStorage.setItem(this.user.getCachePath('settings', false), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.fetchUsers(this.user.id, null, function(data) {
                self.set(data);
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method getActiveParts
         * @returns {Array}
         */
        getActiveParts: function() {
            var parts = [];
            if (this.user.isChinese()) {
                parts = _.intersection(this.get('filterChineseParts'), this.getEnabledParts());
            } else {
                parts = _.intersection(this.get('filterJapaneseParts'), this.getEnabledParts());
            }
            return parts;
        },
        /**
         * @method getActiveStyles
         * @returns {Array}
         */
        getActiveStyles: function() {
            if (this.user.isJapanese()) {
                return ['both', 'none'];
            } else if (this.user.isChinese() && this.get('reviewSimplified') && this.get('reviewTraditional')) {
                return ['both', 'none', 'simp', 'trad'];
            } else if (this.user.isChinese() && this.get('reviewSimplified') && !this.get('reviewTraditional')) {
                return ['both', 'none', 'simp'];
            } else {
                return ['both', 'none', 'trad'];
            }
        },
        /**
         * @method getAllParts
         * @returns {Array}
         */
        getAllParts: function() {
            return this.user.isChinese() ? this.get('allChineseParts') : this.get('allJapaneseParts');
        },
        /**
         * @method getEnabledParts
         * @returns {Array}
         */
        getEnabledParts: function() {
            return this.user.isChinese() ? this.get('chineseStudyParts') : this.get('japaneseStudyParts');
        },
        /**
         * @method getFontClass
         * @return {String}
         */
        getFontClass: function() {
            return this.user.isChinese() ? 'text-chinese' : 'text-japanese';
        },
        /**
         * @method getFontName
         * @return {String}
         */
        getFontName: function() {
            return this.user.isChinese() ? 'Simkai' : 'Kaisho';
        },
        /**
         * @method load
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {UserSettings}
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    var cachedItem = localStorage.getItem(self.user.getCachePath('settings', false));
                    if (cachedItem) {
                        self.set(JSON.parse(cachedItem), {silent: true});
                    }
                    callback();
                },
                function(callback) {
                    self.fetch();
                    callback();
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
            return this;
        },
        /**
         * @method save
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {UserSettings}
         */
        save: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.putUser(this.toJSON(), function(result) {
                self.set(result, {silent: true});
                self.cache();
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess(self);
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
            return this;
        },
        /**
         * @method setActiveParts
         * @param {Array} parts
         * @returns {Array}
         */
        setActiveParts: function(parts) {
            if (this.user.isChinese()) {
                this.set('filterChineseParts', parts);
            } else {
                this.set('filterJapaneseParts', parts);
            }
            return this.getActiveParts();
        },
        /**
         * @method setActiveStyles
         * @param {Array} styles
         * @returns {Array}
         */
        setActiveStyles: function(styles) {
            if (this.user.isChinese()) {
                if (styles.indexOf('simp') === -1) {
                    this.set('reviewSimplified', false);
                } else {
                    this.set('reviewSimplified', true);
                }
                if (styles.indexOf('trad') === -1) {
                    this.set('reviewTraditional', false);
                } else {
                    this.set('reviewTraditional', true);
                }
            }
            return this.getActiveStyles();
        }
    });

    return UserSettings;

});