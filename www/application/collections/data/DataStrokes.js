/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataStroke'
], function(BaseCollection, DataStroke) {
    /**
     * @class DataStrokes
     * @extend BaseCollection
     */
    var DataStrokes = BaseCollection.extend({
        /**
         * @property model
         * @type DataStroke
         */
        model: DataStroke
    });

    return DataStrokes;
});
