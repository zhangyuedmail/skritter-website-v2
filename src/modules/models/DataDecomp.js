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
        idAttribute: 'writing'
    });

    return DataDecomp;

});