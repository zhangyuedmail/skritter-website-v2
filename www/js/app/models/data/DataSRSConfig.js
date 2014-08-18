/**
 * @module Application
 */
define([
   "framework/GelatoModel"
], function(GelatoModel) {
    /**
     * @class DataSRSConfig
     * @extends GelatoModel
     */
    return GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: "part"
    });
});
