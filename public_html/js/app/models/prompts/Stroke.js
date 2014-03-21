/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland 
 */
define(function() {
    /**
     * @class PromptStroke
     */
    var Stroke = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change:points', function(stroke) {
                stroke.set('corners', skritter.fn.shortstraw.process(stroke.clone().get('points')));
            });
        },
        /**
         * @method angle
         * @returns {Number}
         */
        angle: function() {
            return skritter.fn.angle(this.get('corners'));
        },
        /**
         * @method containedIds
         * @returns {Array}
         */
        containedIds: function() {
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
         * @method cornersLength
         * @returns {Number}
         */
        cornersLength: function() {
            var cornersLength = 0;
            var corners = this.get('corners');
            for (var i = 0, length = corners.length - 1; i < length; i++)
                cornersLength += skritter.fn.distance(corners[i], corners[i + 1]);
            return cornersLength;
        },
        /**
         * @method inflatedData
         * @return {Object}
         */
        inflateData: function() {
            var size = skritter.settings.contentWidth();
            var bounds = this.get('shape').getBounds();
            var data = this.get('data');
            return {
                n: data[0],
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
         * @method inflateParams
         * @returns {Array}
         */
        inflateParams: function() {
            var inflatedParams = [];
            var matrix = this.inflateShape().getMatrix();
            var params = skritter.params.where({bitmapId: this.get('bitmapId')});
            for (var a = 0, lengthA = params.length; a < lengthA; a++) {
                var param = params[a].clone();
                var corners = _.cloneDeep(param.get('corners'));
                for (var b = 0, lengthB = corners.length; b < lengthB; b++) {
                    var inflatedCorner = matrix.transformPoint(corners[b].x, corners[b].y);
                    corners[b].x = inflatedCorner.x;
                    corners[b].y = inflatedCorner.y;
                }
                param.set('corners', corners);
                var deviations = _.cloneDeep(param.get('deviations'));
                for (var c = 0, lengthC = deviations.length; c < lengthC; c++) {
                    var inflatedDeviation = matrix.transformPoint(deviations[c].x, deviations[c].y);
                    deviations[c].x = inflatedDeviation.x;
                    deviations[c].y = inflatedDeviation.y;
                }
                param.set('deviations', deviations);
                inflatedParams.push(param);
            }
            return inflatedParams;
        },
        /**
         * @method inflatedSprite
         * @param {String} color
         * @return {CreateJS.Shape}
         */
        inflateShape: function(color) {
            var shape = skritter.assets.stroke(this.get('bitmapId'), color);
            var spriteBounds = shape.getBounds();
            var data = this.inflateData();
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
         * @method rectangle
         * @returns {Object}
         */
        rectangle: function() {
            var size = skritter.settings.contentWidth();
            return skritter.fn.boundingRectangle(_.clone(this.get('corners')), size, size, 14);
        },
        /**
         * @method userShape
         * @param {String} color
         * @returns {CreateJS.Shape}
         */
        userShape: function(color) {
            var shape = this.inflateShape(color);
            var rect = this.rectangle();
            shape.name = 'stroke';
            shape.x = rect.x;
            shape.y = rect.y;
            shape.rotation = this.angle() - this.get('param').angle();
            return shape;
        }
    });

    return Stroke;
});