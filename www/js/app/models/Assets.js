/**
 * @module Application
 */
define([
    "framework/GelatoModel",
    "app/Strokes"
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
            var data = Strokes.getData();
            this.strokes = {};
            for (var strokeId in data) {
                this.strokes[strokeId] = data[strokeId]("#000000");
                this.strokes[strokeId].name = "stroke-" + strokeId;
            }
        }
    });
});
