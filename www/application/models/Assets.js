/**
 * @module Application
 */
define([
    "framework/BaseModel",
    "application/Strokes"
], function(BaseModel, Strokes) {
    /**
     * @class Assets
     * @extends BaseModel
     */
    var Assets = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.strokes = {};
            this.loadAll();
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
         * @returns {Assets}
         */
        loadAll: function() {
            this.loadStrokes();
            return this;
        },
        /**
         * @method loadStrokes
         * @returns {Assets}
         */
        loadStrokes: function() {
            var data = Strokes.getData();
            this.strokes = {};
            for (var strokeId in data) {
                this.strokes[strokeId] = data[strokeId]("#000000");
                this.strokes[strokeId].name = "stroke-" + strokeId;
            }
            return this;
        }
    });

    return Assets;
});