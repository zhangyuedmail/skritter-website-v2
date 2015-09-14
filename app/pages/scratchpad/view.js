var GelatoPage = require('gelato/page');
var Items = require('collections/items');
var Prompt = require('components/prompt/view');

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
        this.prompt = new Prompt();
        this.items = new Items();
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
        this.prompt.setElement('#prompt-container').render();

        this.items.fetch({
            data: {
                include_contained: true,
                include_decomps: true,
                include_sentences: true,
                include_strokes: true,
                include_vocabs: true,
                limit: 5,
                sort: 'next'
            },
            success: (function() {
                var item = this.items.at(3);
                var reviews = item.getPromptReviews();
                this.prompt.set('defn', reviews);
            }).bind(this)
        });

        return this;
    }
});
