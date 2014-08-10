/**
 * @module Application
 */
define([
   "framework/GelatoModel"
], function(GelatoModel) {
    /**
     * @class DataStroke
     * @extends GelatoModel
     */
    return GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: "rune"
    });
});
