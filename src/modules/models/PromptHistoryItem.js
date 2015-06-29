/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class PromptHistoryItem
     * @extends GelatoModel
     */
    var PromptHistoryItem = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(attributes, options) {},
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'timestamp',
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function () {
            return {
                reviews: [],
                timestamp: 0
            };
        }
    });

    return PromptHistoryItem;

});