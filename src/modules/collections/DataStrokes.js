/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/models/DataStroke',
    'modules/data/Kana',
    'modules/data/Tones'
], function(GelatoCollection, DataStroke, Kana, Tones) {

    /**
     * @class DataStrokes
     * @extends GelatoCollection
     */
    var DataStrokes = GelatoCollection.extend({
        /**
         * @method initialize
         * @param {Array|Object} [models]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(models, options) {
            options = options || {};
            this.app = options.app;
            this.add(Kana.getData());
            this.add(Tones.getData());
        },
        /**
         * @property model
         * @type DataStroke
         */
        model: DataStroke
    });

    return DataStrokes;

});