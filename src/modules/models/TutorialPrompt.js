/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class TutorialPrompt
     * @extends GelatoModel
     */
    var TutorialPrompt = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function() {
            return {};
        }
    });

    return TutorialPrompt;

});