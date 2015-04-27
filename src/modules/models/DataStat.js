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
         * @constructor
         */
        initialize: function() {},
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'date'
    });

    return DataStat;

});