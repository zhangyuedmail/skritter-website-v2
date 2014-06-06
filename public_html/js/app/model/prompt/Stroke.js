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
         * @method getAngle
         * @returns {Number}
         */
        getAngle: function() {
            return skritter.fn.getAngle(this.get('corners'));
        },
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
         * @method getCornerLength
         * @returns {Number}
         */
        getCornerLength: function() {
            var cornersLength = 0;
            var corners = this.get('corners');
            for (var i = 0, length = corners.length - 1; i < length; i++) {
                cornersLength += skritter.fn.getDistance(corners[i], corners[i + 1]);
            }
            return cornersLength;
        },
        /**
         * @method getLineDeviations
         * @returns {Array}
         */
        getLineDeviations: function() {
            var deviationPoints = [];
            var corners = _.clone(this.get('corners'));
            var points = _.clone(this.get('points'));
            for (var a = 0, lengthA = corners.length - 1; a < lengthA; a++) {
                var segmentStart = corners[a];
                var segmentEnd = corners[a + 1];
                var segmentPoints = points.slice(_.indexOf(points, segmentStart), _.indexOf(points, segmentEnd));
                var curve, point;
                for (var b = 0, lengthB = segmentPoints.length; b < lengthB; b++) {
                    var direction;
                    var distance = skritter.fn.getDistanceToLineSegment(segmentPoints[0], segmentPoints[segmentPoints.length - 1], segmentPoints[b]);
                    if (!curve || distance > curve) {
                        point = segmentPoints[b];
                        curve = distance;
                        direction = skritter.fn.getAngle(segmentPoints[0], point);
                    }
                }
                deviationPoints.push(point);
            }
            return deviationPoints;
        },
        /**
         * @method getRectangle
         * @returns {Object}
         */
        getRectangle: function() {
            var size = skritter.settings.getContentWidth();
            return skritter.fn.getBoundingRectangle(_.clone(this.get('corners')), size, size, 14);
        },
        /**
         * @method getUserShape
         * @param {String} color
         * @returns {CreateJS.Shape}
         */
        getUserShape: function(color) {
            var shape = this.inflateShape(color);
            var rect = this.getRectangle();
            shape.name = 'stroke';
            shape.x = rect.x;
            shape.y = rect.y;
            shape.rotation = this.getAngle() - this.get('param').getAngle();
            return shape;
        },
        /**
         * @method inflatedData
         * @return {Object}
         */
        inflateData: function() {
            var size = skritter.settings.getCanvasSize();
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
            var params = skritter.user.data.params.where(this.get('bitmapId'));
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
         * @param {Number} alpha
         * @return {CreateJS.Shape}
         */
        inflateShape: function(color, alpha) {
            var shape = skritter.fn.strokes.getShape(this.get('bitmapId'), color);
            var data = this.inflateData();
            if (this.get('kana')) {
                shape.x = data.x;
                shape.y = data.y;
            } else {
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
                shape.alpha = alpha ? alpha : 1;
                shape.x += finalBounds.width / 2 + data.x;
                shape.y += finalBounds.height / 2 + data.y;
            }
            return shape;
        }
    });

    return Stroke;
});