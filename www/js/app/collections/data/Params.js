/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/data/Param",
    "app/Params"
], function(GelatoCollection, DataParam, Params) {
    /**
     * @class DataParams
     * @extend GelatoCollection
     */
    return GelatoCollection.extend({
        /**
         * @property model
         * @type DataParam
         */
        model: DataParam,
        /**
         * @method loadAll
         * @param {Function} callback
         * @returns {DataParams}
         */
        loadAll: function(callback) {
            this.reset();
            this.add(Params.getParams());
            if (typeof callback === "function") {
                callback();
            }
            return this;
        }
    });
});
