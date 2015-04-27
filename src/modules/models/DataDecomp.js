/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataDecomp
     * @extends GelatoModel
     */
    var DataDecomp = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'writing'
    });

    return DataDecomp;

});