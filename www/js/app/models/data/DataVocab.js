/**
 * @module Application
 */
define([
   "framework/GelatoModel"
], function(GelatoModel) {
    /**
     * @class DataVocab
     * @extends GelatoModel
     */
    return GelatoModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: "id",
        /**
         * @method getDefinition
         * @returns {String}
         */
        getDefinition: function() {
            var sourceLang = app.user.settings.get('sourceLang');
            if (this.has('customDefinition') && this.get('customDefinition') !== '') {
                return this.get('customDefinition');
            } else if (this.get('definitions')[sourceLang]) {
                return this.get('definitions')[sourceLang];
            }
            return this.get('definitions').en;
        },
        /**
         * @method getMnemonic
         * @returns {Object}
         */
        getMnemonic: function() {
            if (this.has('mnemonic') && this.get('mnemonic').text !== '') {
                return this.get('mnemonic');
            } else if (this.has('topMnemonic')) {
                return this.get('topMnemonic');
            }
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.get('reviews') === 0 ? true : false;
        }
    });
});
