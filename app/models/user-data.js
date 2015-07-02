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
    defaults: {}
});
