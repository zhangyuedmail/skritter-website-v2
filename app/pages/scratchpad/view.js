var GelatoPage = require('gelato/page');
var Vocabs = require('collections/vocabs');
var Prompt = require('components/prompt/view');
var DefaultNavbar = require('navbars/default/view');

/**
 * @class Scratchpad
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.prompt = new Prompt();
        this.vocabs = new Vocabs();
    },
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property title
     * @type {String}
     */
    title: 'Scratchpad - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Scratchpad}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.render();
        this.prompt.setElement('#prompt-container').render();
        return this;
    },
    /**
     * @method load
     * @param {String} vocabId
     * @param {String} [part]
     */
    load: function(vocabId, part) {
        async.waterfall([
            (function(callback) {
                this.vocabs.fetch({
                    data: {
                        include_decomps: true,
                        include_sentences: true,
                        include_strokes: true,
                        ids: vocabId
                    },
                    error: function(vocabs, error) {
                        callback(error);
                    },
                    success: function(vocabs) {
                        callback(null, vocabs.at(0));
                    }
                });
            }).bind(this),
            (function(vocab, callback) {
                if (vocab.has('containedVocabIds')) {
                    this.vocabs.fetch({
                        data: {
                            include_decomps: true,
                            include_sentences: true,
                            include_strokes: true,
                            ids: vocab.get('containedVocabIds').join('|')
                        },
                        error: function(error) {
                            callback(error);
                        },
                        remove: false,
                        success: function() {
                            callback(null, vocab);
                        }
                    });
                } else {
                    callback(null, vocab);
                }
            }).bind(this)
        ], (function(error, vocab) {
            if (error) {
                //TODO: display error message to user
                console.error('SCRATCHPAD LOAD ERROR:', error);
            } else {
                this.prompt.set(vocab.getPromptReviews(part || 'rune'));
            }
        }).bind(this));
    },
    /**
     * @method remove
     * @returns {Scratchpad}
     */
    remove: function() {
        this.navbar.remove();
        this.prompt.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
