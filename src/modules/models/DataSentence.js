/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataSentence
     * @extends GelatoModel
     */
    var DataSentence = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getWriting
         * @returns {String}
         */
        getWriting: function() {
            return this.get('writing').replace(/\s+/g, '');
        }
    });

    return DataSentence;

});