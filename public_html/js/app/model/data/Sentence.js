define(function() {
    /**
     * @class DataSentence
     */
    var Sentence = Backbone.Model.extend({
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
            skritter.storage.put('sentence', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });

    return Sentence;
});