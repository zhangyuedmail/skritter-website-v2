/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/Kana",
    "app/models/data/DataStroke"
], function(GelatoCollection, Kana, DataStroke) {
    return GelatoCollection.extend({
        /**
         * @class DataStrokes
         * @extend GelatoCollection
         * @constructor
         */
        initialize: function() {
            this.add(Kana.getData());
        },
        /**
         * @property model
         * @type DataStroke
         */
        model: DataStroke
    });
});
