/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataReview
     * @extends BaseModel
     */
    var DataReview = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method isAnswered
         * @returns {Boolean}
         */
        isAnswered: function() {
            return false;
        }
    });

    return DataReview;
});
