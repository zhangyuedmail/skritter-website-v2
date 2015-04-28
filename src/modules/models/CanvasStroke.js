/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class CanvasStroke
     * @extends GelatoModel
     */
    var CanvasStroke = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function() {
            this.on('change:points', this.updateCorners);
            this.updateCorners();
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getFirstAngle
         * @returns {Number}
         */
        getFirstAngle: function() {
            return app.fn.getAngle(this.get('corners')[0], this.get('corners')[1]);
        },
        /**
         * @method getParams
         * @returns {Array}
         */
        getParams: function() {
            var inflatedParams = [];
            var size = this.getSize();
            var matrix = this.getShape().getMatrix();
            var params = app.user.data.params.where({strokeId: this.get('strokeId')});
            for (var a = 0, lengthA = params.length; a < lengthA; a++) {
                var param = params[a].clone();
                if (!param.has('trace')) {
                    var corners = _.cloneDeep(param.get('corners'));
                    for (var b = 0, lengthB = corners.length; b < lengthB; b++) {
                        var inflatedCorner = matrix.transformPoint(corners[b].x, corners[b].y);
                        corners[b].x = inflatedCorner.x;
                        corners[b].y = inflatedCorner.y;
                    }
                    param.set({'corners': corners});
                    param.size = size;
                    inflatedParams.push(param);
                }
            }
            return inflatedParams;
        },
        /**
         * @method getShape
         * @return {createjs.Shape}
         */
        getShape: function() {
            var data = this.inflateData();
            var shape = this.get('shape').clone(true);
            var ms = shape.getMatrix();
            ms.scale(data.scaleX, data.scaleY);
            ms.translate(-data.w / 2, -data.h / 2);
            ms.rotate(data.rot * createjs.Matrix2D.DEG_TO_RAD);
            var t = ms.decompose();
            shape.setTransform(t.x, t.y, t.scaleX, t.scaleY, t.rotation, t.skewX, t.skewY);
            var finalBounds = shape.getTransformedBounds();
            shape.x += finalBounds.width / 2 + data.x;
            shape.y += finalBounds.height / 2 + data.y;
            shape.name = 'stroke-' + this.get('position');
            return shape;
        },
        /**
         * @method size
         * @returns {Number}
         */
        getSize: function() {
            return app.user.settings.get('canvasSize');
        },
        /**
         * @method getUserRectangle
         * @returns {Object}
         */
        getUserRectangle: function() {
            var size = this.getSize();
            var corners = _.clone(this.get('corners'));
            return app.fn.getBoundingRectangle(corners, size, size, 18);
        },
        /**
         * @method getUserShape
         * @returns {createjs.Shape}
         */
        getUserShape: function() {
            var shape = this.getShape();
            //var bounds = shape.getBounds();
            var rect = this.getUserRectangle();
            shape.x = rect.x;
            shape.y = rect.y;
            //shape.scaleX = rect.width / bounds.width;
            //shape.scaleY = rect.height / bounds.height;
            shape.name = 'stroke';
            return shape;
        },
        /**
         * @method inflatedData
         * @return {Object}
         */
        inflateData: function() {
            var size = this.getSize();
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
         * @method updateCorners
         * @returns {CanvasStroke}
         */
        updateCorners: function() {
            var points = _.clone(this.get('points'));
            this.set('corners', app.fn.shortstraw.process(points));
            return this;
        }
    });

    return CanvasStroke;

});