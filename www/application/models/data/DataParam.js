/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataParam
     * @extends BaseModel
     */
    var DataParam = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method angle
         * @returns {Number}
         */
        getAngle: function() {
            return app.fn.getAngle(this.get('corners'));
        },
        /**
         * @method getCornerLength
         * @returns {Number}
         */
        getLength: function() {
            var cornersLength = 0;
            var corners = this.get('corners');
            for (var i = 0, length = corners.length - 1; i < length; i++) {
                cornersLength += app.fn.getDistance(corners[i], corners[i + 1]);
            }
            return cornersLength;
        },
        /**
         * @method getRectangle
         * @returns {Object}
         */
        getRectangle: function() {
            var canvasSize = app.get('canvasSize');
            var corners = _.clone(this.get('corners'));
            return app.fn.getBoundingRectangle(corners, canvasSize, canvasSize, 12);
        },
        /**
         * @method getStartingAngle
         * @returns {Number}
         */
        getStartingAngle: function() {
            return app.fn.getAngle(this.get('corners')[0], this.get('corners')[1]);
        }
    });

    return DataParam;
});
