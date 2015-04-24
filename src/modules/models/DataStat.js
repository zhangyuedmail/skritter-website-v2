/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataStat
     * @extends GelatoModel
     */
    var DataStat = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.app = options.app || this.collection.app;
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'date'
    });

    return DataStat;

});