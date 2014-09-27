/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class UserSettings
     * @extends BaseModel
     */
    var UserSettings = BaseModel.extend({
        /**
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.user = options.user;
            this.on('change', this.cache);
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-settings', JSON.stringify(this.toJSON()));
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            audio: true,
            audioPitch: '100',
            audioSpeed: '60',
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune']
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            var self = this;
            app.api.getUsers(this.user.id, null, function(data) {
                self.set(data);
                callback();
            }, function(error) {
                callback(error);
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
         * @method getCustomData
         * @returns {Object}
         */
        getCustomData: function() {
            return {};
        },
        /**
         * @method getEnabledParts
         * @returns {Array}
         */
        getEnabledParts: function() {
            return this.user.isChinese() ? this.get('chineseStudyParts') : this.get('japaneseStudyParts');
        },
        /**
         * @method getTags
         * @returns {Array}
         */
        getTags: function() {
            var tags = [];
            if (this.user.isChinese()) {
                if (this.get('reviewSimplified') && this.get('reviewTraditional')) {
                    tags = ['chinese', 'simplified', 'traditional'];
                } else if (this.get('reviewSimplified')) {
                    tags = ['chinese', 'simplified', 'traditional'];
                } else if (this.get('reviewTraditional')) {
                    tags = ['chinese', 'traditional'];
                }
            } else if (this.user.isJapanese()) {
                tags = ['japanese'];
            }
            return tags;
        },
        /**
         * @method setActiveParts
         * @param {Array} parts
         * @returns {Array}
         */
        setActiveParts: function(parts) {
            if (this.user.isChinese()) {
                this.set('filterChineseParts', parts);
                this.update();
                return _.intersection(this.get('filterChineseParts'), this.getEnabledParts());
            }
            this.set('filterJapaneseParts', parts);
            this.update();
            return _.intersection(this.get('filterJapaneseParts'), this.getEnabledParts());
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
            this.update();
            return this.getActiveStyles();
        },
        /**
         * @method update
         * @param {Function} [callback]
         */
        update: function(callback) {
            var self = this;
            app.api.updateUser(this.toJSON(), function(user) {
                self.set(user);
                if (typeof callback === 'function') {
                    callback();
                }
            }, function(error) {
                if (typeof callback === 'function') {
                    callback(error);
                }
            });
        }
    });

    return UserSettings;
});