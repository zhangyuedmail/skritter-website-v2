/**
 * @module Application
 */
define([
    "framework/GelatoModel"
], function(GelatoModel) {
    /**
     * @class PromptStroke
     * @extends GelatoModel
     */
    return GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: "id",
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            corners: [],
            data: [],
            id: 0,
            points: [],
            position: 0,
            shape: undefined,
            strokeId: 0,
            variation: 0
        },
        /**
         * @method inflateData
         * @param {Number} size
         * @returns {Object}
         */
        inflateData: function(size) {
            var bounds = this.get("shape").getBounds();
            var data = this.get("data");
            return {
                strokeId: data[0],
                x: data[1] * size,
                y: data[2] * size,
                w: data[3] * size,
                h: data[4] * size,
                scaleX: (data[3] * size) / bounds.width,
                scaleY: (data[4] * size) / bounds.height,
                rot: -data[5]
            };
        },
        /**
         * @method inflateShape
         * @param {Number} size
         * @returns {createjs.Shape}
         */
        inflateShape: function(size) {
            var shape = this.get("shape").clone(true);
            var data = this.inflateData(size);
            var spriteBounds = shape.getBounds();
            var ms = shape.getMatrix();
            //apply rotation based on newly sized shape
            var sx = data.w / spriteBounds.width;
            var sy = data.h / spriteBounds.height;
            ms.scale(sx, sy);
            ms.translate(-data.w / 2, -data.h / 2);
            ms.rotate(data.rot * Math.PI / 180);
            var t = ms.decompose();
            //find the actual position based on prior transformations
            shape.setTransform(t.x, t.y, t.scaleX, t.scaleY, t.rotation, t.skewX, t.skewY);
            var finalBounds = shape.getTransformedBounds();
            shape.x += finalBounds.width / 2 + data.x;
            shape.y += finalBounds.height / 2 + data.y;
            return shape;
        }
    });
});
