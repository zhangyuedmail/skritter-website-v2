/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class TutorialModel
     * @extends GelatoModel
     */
    var TutorialModel = GelatoModel.extend({
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

    return TutorialModel;

});