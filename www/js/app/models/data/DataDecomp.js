/**
 * @module Application
 */
define([
   "framework/GelatoModel"
], function(GelatoModel) {
    /**
     * @class DataModel
     * @extends GelatoModel
     */
    return GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: "writing"
    });
});
