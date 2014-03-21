/**
 * @module Skritter
 * @submodule Views
 * @param templateInfo
 * @author Joshua McFarland
 */
define([
    'require.text!templates/info.html'
], function(templateInfo) {
    /**
     * @class Info
     */
    var Info = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Info.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateInfo);
            if (Info.vocab) {
                this.$('#writing-primary').html(Info.vocab.get('writing'));
                this.$('#reading').html(Info.vocab.reading());
                this.$('#definition').html(Info.vocab.definition());
                if (Info.vocab.has('sentenceId')) {
                    this.$('#sentence .writing').html(Info.vocab.sentence().get('writing'));
                    this.$('#sentence .reading').html(Info.vocab.sentence().reading());
                    this.$('#sentence .definition').html(Info.vocab.sentence().definition());
                } else {
                    this.$('#sentence').hide();
                }
            }
            return this;
        },
        /**
         * @method load
         * @param {String} language
         * @param {String} writing
         */
        load: function(language, writing) {
            var base = skritter.fn.simptrad.toBase(writing);
            skritter.user.data.loadVocab(base, _.bind(function(vocab) {
                Info.vocab = vocab;
                this.render();
            }, this));
        }
    });

    return Info;
});


