/**
 * @module Skritter
 * @submodule Collections
 * @param KanaStrokeData
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'function/KanaStrokeData',
    'model/data/Stroke'
], function(KanaStrokeData, Stroke) {
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
            this.add(KanaStrokeData, {merge: true, silent: true, sort: false});
        },
        /**
         * @property {Stroke} model
         */
        model: Stroke,
        /**
         * @method insert
         * @param {Array|Object} strokes
         * @param {Function} callback
         */
        insert: function(strokes, callback) {
            skritter.storage.put('strokes', strokes, callback);
            strokes = null;
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
            var models = [];
            for (var i = 1, length = this.length; i < length; i++) {
                var model = this.models[i];
                if (model.attributes.rune !== 'tone' && !model.has('kana'))
                    models.push(model);
            }
            this.remove(models);
        }
    });

    return Strokes;
});