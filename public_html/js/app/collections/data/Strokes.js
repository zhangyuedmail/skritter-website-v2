/**
 * @module Skritter
 * @submodule Collections
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'models/data/Stroke'
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
            });
        },
        /**
         * @property {Stroke} model
         */
        model: Stroke,
        /**
         * @method insert
         * @param {Array} strokes
         * @param {Function} callback
         */
        insert: function(strokes, callback) {
            var self = this;
            skritter.storage.put('strokes', strokes, function() {
                //self.add(strokes, {merge: true, silent: true});
                callback();
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('strokes', function(strokes) {
                self.add(strokes, {merge: true, silent: true});
                callback();
            });
        }
    });

    return Strokes;
});