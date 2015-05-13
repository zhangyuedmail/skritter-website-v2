/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataStroke',
    'modules/data/KanaData',
    'modules/data/ToneData'
], function(GelatoCollection, DataStroke, KanaData, ToneData) {

    /**
     * @class DataStrokes
     * @extends GelatoCollection
     */
    var DataStrokes = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.add(KanaData.getData());
            this.add(ToneData.getData());
        },
        /**
         * @property model
         * @type DataStroke
         */
        model: DataStroke
    });

    return DataStrokes;

});