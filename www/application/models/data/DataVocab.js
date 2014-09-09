/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataVocab
     * @extends BaseModel
     */
    var DataVocab = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getContainedItemIds
         * @param {String} part
         * @returns {Array}
         */
        getContainedItemIds: function(part) {
            var containedItemIds = [];
            var containedVocabIds = this.get('containedVocabIds');
            for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                if (part === 'tone') {
                    var splitId = containedVocabIds[i].split('-');
                    containedItemIds.push(app.user.id + '-' + splitId[0] + '-' + splitId[1] + '-0-' + part);
                } else {
                    containedItemIds.push(app.user.id + '-' + containedVocabIds[i] + '-' + part);
                }
            }
            return containedItemIds;
        }
    });

    return DataVocab;
});
