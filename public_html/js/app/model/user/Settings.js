define([], function() {
    /**
     * @class UserSettings
     */
    var Model = Backbone.Model.extend({
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
            addItemAmount: 1,
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
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            skritter.api.getUser(skritter.user.id, _.bind(function(result, status) {
                if (status === 200) {
                    this.set(result);
                    callback(null, status);
                } else {
                    callback(result, status);
                }
            }, this));
        }
    });
    
    return Model;
});