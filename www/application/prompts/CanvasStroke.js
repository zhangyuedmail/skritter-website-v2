/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class CanvasStroke
     * @extends BaseModel
     */
    var CanvasStroke = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('change:points', this.updateCorners);
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getContainedIds
         * @returns {Array}
         */
        getContainedIds: function() {
            var ids = [];
            var contains = this.has('contains') ? this.get('contains') : [];
            var position = this.get('position');
            for (var i = 0, length = contains.length; i < length; i++) {
                var contained = contains[i];
                ids.push(position + '|' + contained);
                ids.push((position + 1) + '|' + contained);
            }
            return ids;
        },
        /**
         * @method getShape
         * @param {Number} canvasSize
         * @return {createjs.Shape}
         */
        getShape: function(canvasSize) {
            var shape = this.get('shape').clone(true);
            var data = this.inflateData(canvasSize);
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
            shape.name = 'stroke';
            shape.x += finalBounds.width / 2 + data.x;
            shape.y += finalBounds.height / 2 + data.y;
            return shape;
        },
        /**
         * @method getUserShape
         * @param {Number} canvasSize
         * @returns {createjs.Shape}
         */
        getUserShape: function(canvasSize) {
            var shape = this.inflateShape(canvasSize);
            var bounds = shape.getBounds();
            var rect = this.getRectangle();
            shape.name = 'stroke';
            shape.x = rect.x;
            shape.y = rect.y;
            shape.scaleX = rect.w / bounds.width;
            shape.scaleY = rect.h / bounds.height;
            return shape;
        },
        /**
         * @method inflatedData
         * @param {Number} canvasSize
         * @return {Object}
         */
        inflateData: function(canvasSize) {
            var bounds = this.get('shape').getBounds();
            var data = this.get('data');
            return {
                n: data[0],
                x: data[1] * canvasSize,
                y: data[2] * canvasSize,
                w: data[3] * canvasSize,
                h: data[4] * canvasSize,
                scaleX: (data[3] * canvasSize) / bounds.width,
                scaleY: (data[4] * canvasSize) / bounds.height,
                rot: -data[5]
            };
        },
        /**
         * @method updateCorners
         */
        updateCorners: function() {
            var clonedPoints = _.clone(this.get('points'));
            this.set('corners', app.fn.shortstraw.process(clonedPoints));
        }
    });

    return CanvasStroke;
});
