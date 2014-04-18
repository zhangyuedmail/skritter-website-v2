define([
    'collection/data/Decomps',
    'collection/data/Items',
    'collection/data/Reviews',
    'collection/data/Sentences',
    'collection/data/SRSConfigs',
    'collection/data/Strokes',
    'collection/data/VocabLists',
    'collection/data/Vocabs'
], function(Decomps, Items, Reviews, Sentences, SRSConfigs, Strokes, VocabLists, Vocabs) {
    /**
     * @class UserData
     */
    var Data = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.decomps = new Decomps();
            this.items = new Items();
            this.reviews = new Reviews();
            this.sentences = new Sentences();
            this.srsconfigs = new SRSConfigs();
            this.strokes = new Strokes();
            this.vocablists = new VocabLists();
            this.vocabs = new Vocabs();
        },
        /**
         * @method add
         * @param {Object} data
         * @param {Object} options
         * @return {Backbone.Model}
         */
        add: function(data, options) {
            this.decomps.add(data.Decomps, options);
            this.items.add(data.Items, options);
            this.sentences.add(data.Sentences, options);
            this.srsconfigs.add(data.SRSConfigs, options);
            this.strokes.add(data.Strokes, options);
            this.vocablists.add(data.VocabLists, options);
            this.vocabs.add(data.Vocabs, options);
            return this;
        },
        /**
         * @method add
         * @param {Object} data
         * @param {Function} callback
         */
        insert: function(data, callback) {
            async.series([
                async.apply(this.decomps.insert, data.Decomps),
                async.apply(this.items.insert, data.Items),
                async.apply(this.sentences.insert, data.Sentences),
                async.apply(this.srsconfigs.insert, data.SRSConfigs),
                async.apply(this.strokes.insert, data.Strokes),
                async.apply(this.vocablists.insert, data.VocabLists),
                async.apply(this.vocabs.insert, data.Vocabs)
            ], callback);
        }
    });
    
    return Data;
});