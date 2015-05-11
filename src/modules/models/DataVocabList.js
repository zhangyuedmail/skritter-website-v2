/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataVocabList
     * @extends GelatoModel
     */
    var DataVocabList = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('change', this.save);
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getChanged
         * @returns {Object}
         */
        getChanged: function() {
            return $.extend(this.changed, {id: this.id});
        },
        /**
         * @method getPercentAdded
         * @returns {Number}
         */
        getPercentAdded: function() {
            var addedRows = 0;
            var totalRows = 0;
            var sections = this.get('sections') || [];
            for (var a = 0, lengthA = sections.length; a < lengthA; a++) {
                var rows = sections[a].rows || [];
                for (var b = 0, lengthB = rows.length; b < lengthB; b++) {}
            }
            return totalRows > 0 ? addedRows/totalRows : 0;
        },
        /**
         * @method getWordCount
         * @returns {Number}
         */
        getWordCount: function() {
            var count = 0;
            var rows = _.pluck(this.get('sections'), 'rows');
            for (var i = 0, length = rows.length; i < length; i++) {
                count += rows[i].length;
            }
            return count;
        },
        /**
         * @method save
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {DataVocabList}
         */
        save: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    app.api.putVocabList(self.getChanged(), function(result) {
                        self.set(result, {silent: true});
                        callback();
                    }, function(error) {
                        callbackError(error);
                    });
                }, function(callback) {
                    app.user.data.storage.put('vocablists', self.toJSON(), function() {
                        callback();
                    }, function(error) {
                        callbackError(error);
                    });
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess(self);
                    }
                }
            });
            return this;
        }
    });

    return DataVocabList;

});