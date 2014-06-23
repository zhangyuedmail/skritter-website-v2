define([
    'model/data/VocabList'
], function(VocabList) {
    /**
     * class DataVocabLists
     */
    var VocabLists = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: VocabList,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocablists', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method comparator
         * @param {Backbone.Model} vocablist
         */
        comparator: function(vocablist) {
            if (vocablist.has('name') && vocablist.has('studyingMode')) {
                var studyingMode = vocablist.attributes.studyingMode;
                if (studyingMode === 'adding') {
                    return '1-' + vocablist.attributes.name;
                } else if (studyingMode === 'reviewing') {
                    return '2-' + vocablist.attributes.name;
                } else if (studyingMode === 'not studying') {
                    return '3-' + vocablist.attributes.name;
                } else {
                    return '4-' + vocablist.attributes.name;
                }
            } else if (vocablist.has('name')) {
                return vocablist.attributes.name;
            }
            return vocablist.id;
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            async.waterfall([
                function(callback) {
                    skritter.api.getVocabLists(function(lists, status) {
                        if (status === 200) {
                            callback(null, lists);
                        } else {
                            callback(lists);
                        }
                    }, {lang: skritter.user.getLanguageCode(), sort: 'studying'});
                },
                function(lists, callback) {
                    skritter.storage.clear('vocablists', function() {
                        skritter.user.data.vocablists.reset();
                        skritter.user.data.vocablists.insert(lists, callback);
                    });
                },
                function(callback) {
                    skritter.user.data.vocablists.loadAll(callback);
                }
            ], callback);
        },
        /**
         * @method filterByStatus
         * @param {Array|String} status
         * @returns {Backbone.View}
         */
        filterByStatus: function(status) {
            status = Array.isArray(status) ? status : [status];
            var filtered = this.filter(function(list) {
                return status.indexOf(list.attributes.studyingMode) !== -1;
            });
            return new VocabLists(filtered);
        },
        /**
         * @method insert
         * @param {Array|Object} lists
         * @param {Function} callback
         */
        insert: function(lists, callback) {
            skritter.storage.put('vocablists', lists, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocablists', _.bind(function(vocablists) {
                this.add(vocablists, {merge: true, silent: true});
                this.trigger('loaded');
                callback();
            }, this));
        }
    });

    return VocabLists;
});