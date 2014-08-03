/**
 * @module Application
 */
define([
    "framework/GelatoModel",
    "app/data/Strokes"
], function(GelatoModel, Strokes) {
    return GelatoModel.extend({
        /**
         * @class Assets
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.strokes = {};
        },
        /**
         * @method getStroke
         * @param {Number} strokeId
         * @returns {createjs.Shape}
         */
        getStroke: function(strokeId) {
            return this.strokes[strokeId].clone(true);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            this.loadStrokes();
            callback();
        },
        /**
         * @method loadStrokes
         */
        loadStrokes: function() {
            this.strokes = {};
            for (var strokeId in Strokes) {
                this.strokes[strokeId] = Strokes[strokeId]("#000000");
                this.strokes[strokeId].name = "stroke-" + strokeId;
            }
        }
    });
});
