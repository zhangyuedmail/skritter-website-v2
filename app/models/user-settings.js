var SkritterModel = require('base/skritter-model');

/**
 * @class UserSettings
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.on('state:standby', this.cache);
    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        allChineseParts: ['defn', 'rdng', 'rune', 'tone'],
        allJapaneseParts: ['defn', 'rdng', 'rune'],
        gradingColors: {1: '#e74c3c', 2: '#ebbd3e', 3: '#87a64b', 4: '#4d88e3'},
        goals: {ja: {items: 20}, zh: {items: 20}}
    },
    /**
     * @method cache
     * @returns {UserSettings}
     */
    cache: function() {
        app.user.setLocalData('settings', this.toJSON());
        this.updateRaygun();
        return this;
    },
    /**
     * @method getAllParts
     * @returns {Array}
     */
    getAllParts: function() {
        return app.isChinese() ? this.get('allChineseParts') : this.get('allJapaneseParts');
    },
    /**
     * @method getGoal
     * @returns {Object}
     */
    getGoal: function() {
        var goal = this.get('goals')[app.get('language')];
        var type = Object.keys(goal)[0];
        return {type: type, value: goal[type]};
    },
    /**
     * @method getRaygunTags
     * @returns {Array}
     */
    getRaygunTags: function() {
        var tags = [];
        if (app.isChinese()) {
            tags.push('chinese');
            if (this.get('reviewSimplified')) {
                tags.push('simplified');
            }
            if (this.get('reviewTraditional')) {
                tags.push('traditional')
            }
        }
        if (app.isJapanese()) {
            tags.push('japanese')
        }
        return tags;
    },
    /**
     * @method getStudyParts
     * @returns {Object}
     */
    getStudyParts: function() {
        return app.getLanguage() ? this.get('chineseStudyParts') : this.get('japaneseStudyParts');
    },
    /**
     * @method hasStudyPart
     * @param {String} part
     * @returns {Boolean}
     */
    hasStudyPart: function(part) {
        return this.getStudyParts().indexOf(part) > -1;
    },
    /**
     * @method isAudioEnabled
     * @returns {Boolean}
     */
    isAudioEnabled: function() {
        return this.get('volume') > 0;
    },
    /**
     * @method load
     * @returns {UserSettings}
     */
    load: function() {
        var settings = app.user.getLocalData('settings');
        if (settings) {
            this.set(settings, {silent: true});
            if (app.get('language') === 'undefined') {
                app.set('language', this.get('targetLang'));
            }
            this.updateRaygun();
        }
        return this;
    },
    /**
     * @method parse
     * @param {Object} response
     * @returns {Object}
     */
    parse: function(response) {
        return response.User;
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
        goals[app.get('language')] = goal;
        this.set('goals', goals);
        this.trigger('change:goals', this);
        this.save();
        return this;
    },
    /**
     * @method updateRaygun
     * @returns {UserSettings}
     */
    updateRaygun: function() {
        Raygun.setUser(this.get('name'), false, this.get('email'));
        Raygun.withTags(this.getRaygunTags());
        return this;
    },
    /**
     * @method urlRoot
     * @returns {String}
     */
    urlRoot: 'users'
});