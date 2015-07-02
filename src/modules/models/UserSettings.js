/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(
    GelatoModel
) {

    /**
     * @class UserSettings
     * @extends GelatoModel
     */
    var UserSettings = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('change', this.save);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            allChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            allJapaneseParts: ['defn', 'rdng', 'rune'],
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune'],
            gradingColors: {1: '#e74c3c', 2: '#ebbd3e', 3: '#87a64b', 4: '#4d88e3'},
            goals: {ja: {time: 20}, zh: {time: 20}},
            syncMode: 'jit'
        },
        /**
         * @method cache
         * @returns {UserSettings}
         */
        cache: function() {
            localStorage.setItem(app.user.getDataPath('settings', false), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            if (!app.user.isLoggedIn()) {
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
                return;
            }
            app.api.fetchUsers(app.user.id, null, function(data) {
                self.set(data, {merge: true});
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
            if (app.user.isChinese()) {
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
            if (app.user.isJapanese()) {
                return ['both', 'none'];
            } else if (app.user.isChinese() && this.get('reviewSimplified') && this.get('reviewTraditional')) {
                return ['both', 'none', 'simp', 'trad'];
            } else if (app.user.isChinese() && this.get('reviewSimplified') && !this.get('reviewTraditional')) {
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
            return app.user.isChinese() ? this.get('allChineseParts') : this.get('allJapaneseParts');
        },
        /**
         * @method getAvatar
         * @returns {String}
         */
        getAvatar: function() {
            return '<img src="data:image/png;base64,' + this.get('avatar') + '" alt="">';
        },
        /**
         * @method getEnabledParts
         * @returns {Array}
         */
        getEnabledParts: function() {
            return app.user.isChinese() ? this.get('chineseStudyParts') : this.get('japaneseStudyParts');
        },
        /**
         * @method getFontClass
         * @return {String}
         */
        getFontClass: function() {
            return app.user.isChinese() ? 'text-chinese' : 'text-japanese';
        },
        /**
         * @method getFontName
         * @return {String}
         */
        getFontName: function() {
            return app.user.isChinese() ? 'Simkai' : 'Kaisho';
        },
        /**
         * @method getGoal
         * @returns {Object}
         */
        getGoal: function() {
            var goal = this.get('goals')[app.user.getLanguageCode()];
            var type = Object.keys(goal)[0];
            return {type: type, value: goal[type]};
        },
        /**
         * @method getRequestParts
         * @returns {String}
         */
        getRequestParts: function() {
            return this.getActiveParts().join(',');
        },
        /**
         * @method getRequestStyles
         * @returns {String}
         */
        getRequestStyles: function() {
            if (app.user.isChinese()) {
                if (this.get('reviewSimplified') && this.get('reviewTraditional')) {
                    return ['both', 'simp', 'trad'].join(',');
                } else if (this.get('reviewSimplified') && !this.get('reviewTraditional')) {
                    return ['both', 'simp'].join(',');
                } else if (!this.get('reviewSimplified') && this.get('reviewTraditional')) {
                    return ['both', 'trad'].join(',');
                }
            }
        },
        /**
         * @method isAudioEnabled
         * @returns {Boolean}
         */
        isAudioEnabled: function() {
            return this.get('volume') > 0;
        },
        /**
         * @method isJIT
         * @returns {Boolean}
         */
        isJIT: function() {
            return this.get('syncMode') === 'jit';
        },
        /**
         * @method load
         * @returns {UserSettings}
         */
        load: function() {
            var settings = localStorage.getItem(app.user.getDataPath('settings', false));
            if (settings) {
                this.set(JSON.parse(settings), {silent: true});
            }
            return this;
        },
        /**
         * @method save
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        save: function(callbackSuccess, callbackError) {
            var self = this;
            if (!app.user.isLoggedIn()) {
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
                return;
            }
            app.api.putUser(this.toJSON(), function(result) {
                self.set(result, {merge: true, silent: true});
                self.cache();
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess(self);
                }
            }, function(error) {
                self.cache();
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method setActiveParts
         * @param {Array} parts
         * @returns {Array}
         */
        setActiveParts: function(parts) {
            if (app.user.isChinese()) {
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
            if (!app.user.isChinese()) {
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
        },
        /**
         * @method setGoal
         * @param {String} type
         * @param {String} value
         * @returns {UserSettings}
         */
        setGoal: function(type, value) {
            var goal = {};
            var goals = this.get('goals');
            goal[type] = parseInt(value, 10);
            goals[app.user.getLanguageCode()] = goal;
            this.set('goals', goals);
            this.save();
            return this;
        }
    });

    return UserSettings;

});