define([], function() {
    /**
     * @class DataItem
     */
    var Item = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.readiness = 0;
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('items', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });

    return Item;
});