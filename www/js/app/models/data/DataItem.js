/**
 * @module Application
 */
define([
    "framework/GelatoModel"
], function(GelatoModel) {
    /**
     * @class DataItem
     * @extends GelatoModel
     */
    return GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: "id",
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            "created": moment().unix(),
            "changed": moment().unix(),
            "interval": 0,
            "lang": undefined,
            "last": 0,
            "next": 0,
            "part": undefined,
            "previousInterval": 0,
            "previousSuccess": false,
            "reviews": 0,
            "sectionIds": [],
            "style": undefined,
            "successes": 0,
            "timeStudied": 0,
            "vocabIds": [],
            "vocabListIds": []
        }
    });
});
