/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class PromptResult
     * @extends GelatoModel
     */
    var PromptResult = GelatoModel.extend({
        /**
         * @method defaults
         * @returns {Object}
         */
        defaults: function() {
            return {
                character: null,
                complete: false,
                reviewTime: 0,
                score: 3,
                submitTime: Moment().unix(),
                thinkingTime: 0,
                vocabId: null
            };
        }
    });

    return PromptResult;

});