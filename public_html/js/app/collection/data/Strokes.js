define([
    'model/data/Stroke'
], function(Stroke) {
    /**
     * @class DataStrokes
     */
    var Strokes = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add({
                lang: 'zh',
                rune: 'tones',
                strokes: [
                    [[383, 0.20, 0.20, 0.6, 0.1, 0.0]],
                    [[384, 0.25, 0.25, 0.5, 0.5, 0.0]],
                    [[385, 0.15, 0.20, 0.7, 0.6, 0.0]],
                    [[386, 0.25, 0.25, 0.5, 0.5, 0.0]],
                    [[387, 0.40, 0.40, 0.20, 0.20, 0.0]]
                ]
            }, {merge: true, silent: true, sort: false});
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
        }
    });

    return Strokes;
});