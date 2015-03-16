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
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
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
        }
    });

    return DataVocabList;

});