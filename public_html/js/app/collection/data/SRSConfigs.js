define([
    'model/data/SRSConfig'
], function(SRSConfig) {
    /**
     * @class DataSRSConfigs
     */
    var SRSConfigs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: SRSConfig,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('srsconfigs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            skritter.api.getSRSConfigs(skritter.user.getLanguageCode(), function(configs, status) {
                if (status === 200) {
                    skritter.user.data.srsconfigs.reset();
                    skritter.user.data.srsconfigs.add(configs);
                    skritter.user.data.srsconfigs.cache(callback);
                } else if (skritter.user.data.srsconfigs.length === 0) {
                    skritter.user.data.srsconfigs.loadDefaults();
                    callback();
                } else {
                    callback();
                }
            });
        },
        /**
         * @method insert
         * @param {Array|Object} srsconfigs
         * @param {Function} callback
         */
        insert: function(srsconfigs, callback) {
            skritter.storage.put('srsconfigs', srsconfigs, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('srsconfigs', _.bind(function(reviews) {
                this.add(reviews, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        },
        /**
         * @method loadDefaults
         */
        loadDefaults: function() {
            var lang = skritter.user.getLanguageCode();
            this.reset();
            this.add([
                {"lang": lang, "initialWrongInterval": 600, "wrongFactors": [0.25, 0.25, 0.25, 0.25], "part": "defn", "rightFactors": [2.2, 2.2, 2.2, 2.2], "initialRightInterval": 604800},
                {"lang": lang, "initialWrongInterval": 600, "wrongFactors": [0.25, 0.25, 0.25, 0.25], "part": "rdng", "rightFactors": [2.2, 2.2, 2.2, 2.2], "initialRightInterval": 604800},
                {"lang": lang, "initialWrongInterval": 600, "wrongFactors": [0.25, 0.25, 0.25, 0.25], "part": "rune", "rightFactors": [2.2, 2.2, 2.2, 2.2], "initialRightInterval": 604800},
                {"lang": lang, "initialWrongInterval": 600, "wrongFactors": [0.25, 0.25, 0.25, 0.25], "part": "tone", "rightFactors": [2.2, 2.2, 2.2, 2.2], "initialRightInterval": 604800}
            ]);
        }
    });

    return SRSConfigs;
});