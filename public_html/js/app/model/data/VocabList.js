define(function() {
    /**
     * @class DataVocabList
     */
    var VocabList = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocablists', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method uncache
         * @param {Function} callback
         */
        uncache: function(callback) {
            skritter.storage.remove('vocablists', this.id, function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });
    
    return VocabList;
});