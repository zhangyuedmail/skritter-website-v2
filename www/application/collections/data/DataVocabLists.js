/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataVocabList'
], function(BaseCollection, DataVocabList) {
    /**
     * @class DataVocabLists
     * @extend BaseCollection
     */
    var DataVocabLists = BaseCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('add change', function(vocablist) {
                vocablist.cache();
            });
        },
        /**
         * @property model
         * @type DataVocabList
         */
        model: DataVocabList,
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('vocablists', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method getActive
         * @returns {Array}
         */
        getActive: function() {
            return this.filter(function(list) {
                return list.get('studyingMode') !== 'not studying';
            });
        },
        /**
         * @method getFiltered
         * @returns {Array}
         */
        getFiltered: function() {
            var filterLists = app.user.settings.get('filterLists');
            return this.filter(function(list) {
                return filterLists.indexOf(list.id) > -1;
            });
        },
        /**
         * @method hasActive
         * @returns {Boolean}
         */
        hasActive: function() {
            return this.pluck('studyingMode').indexOf('adding') > -1;
        },
        /**
         * @method hasPaused
         * @returns {Boolean}
         */
        hasPaused: function() {
            return this.pluck('studyingMode').indexOf('reviewing') > -1;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('vocablists', function (data) {
                self.reset();
                self.lazyAdd(data, callback, {silent: true});
            });
        }
    });

    return DataVocabLists;
});
