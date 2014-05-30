define(function() {
    /**
     * @class DataDecomp
     */
    var Decomp = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
	/**
         * @property {String} idAttribute
         */
        idAttribute: 'writing',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('decomps', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });
    
    return Decomp;
});