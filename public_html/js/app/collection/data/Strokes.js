define([
    'model/data/Stroke',
    'function/ToneData'
], function(Stroke, ToneData) {
    /**
     * @class DataStrokes
     */
    var Strokes = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add(ToneData, {merge: true, silent: true, sort: false});
        },
        /**
         * @property {Stroke} model
         */
        model: Stroke,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('strokes', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('strokes', _.bind(function(strokes) {
                this.add(strokes, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        },
        /**
         * @method reset
         */
        reset: function() {
            Backbone.Collection.prototype.reset.call(this);
            this.add(ToneData);
        }
    });

    return Strokes;
});