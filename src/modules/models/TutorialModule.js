/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class TutorialModule
     * @extends GelatoModel
     */
    var TutorialModule = GelatoModel.extend({
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

    return TutorialModule;

});