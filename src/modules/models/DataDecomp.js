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
         * @property idAttribute
         * @type String
         */
        idAttribute: 'writing'
    });

    return DataDecomp;

});