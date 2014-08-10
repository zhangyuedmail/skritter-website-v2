/**
 * @module Application
 */
define([
   "framework/GelatoModel"
], function(GelatoModel) {
    /**
     * @class DataItem
     * @extends GelatoModel
     */
    return GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: "id"
    });
});
