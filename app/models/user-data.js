var GelatoModel = require('gelato/modules/model');
var DataDecomps = require('collections/data-decomps');
var DataItems = require('collections/data-items');
var DataParams = require('collections/data-params');
var DataSentences = require('collections/data-sentences');
var DataStats = require('collections/data-stats');
var DataStrokes = require('collections/data-strokes');
var DataVocablists = require('collections/data-vocablists');
var DataVocabs = require('collections/data-vocabs');

/**
 * @class UserData
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.decomps = new DataDecomps();
        this.items = new DataItems();
        this.params = new DataParams();
        this.sentences = new DataSentences();
        this.stats = new DataStats();
        this.strokes = new DataStrokes();
        this.vocablists = new DataVocablists();
        this.vocabs = new DataVocabs();
    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {},
    /**
     * @method add
     * @param {Object} result
     * @param {Object} [options]
     * @param {Function} [callback]
     */
    add: function(result, options, callback) {
        async.parallel([
            function(callback) {
                app.user.data.decomps.add(result.Decomps || [], options);
                callback();
            },
            function(callback) {
                app.user.data.items.add(result.ContainedItems || [], options);
                callback();
            },
            function(callback) {
                app.user.data.items.add(result.Items || [], options);
                callback();
            },
            function(callback) {
                app.user.data.sentences.add(result.Sentences || [], options);
                callback();
            },
            function(callback) {
                app.user.data.strokes.add(result.Strokes || [], options);
                callback();
            },
            function(callback) {
                app.user.data.vocabs.add(result.Vocabs || [], options);
                callback();
            }
        ], callback);
    }
});
