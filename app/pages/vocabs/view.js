var GelatoPage = require('gelato/page');
var VocabViewer = require('components/vocab-viewer/view');

/**
 * @class Vocabs
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.viewer = new VocabViewer();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Vocabs - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/vocabs/template'),
    /**
     * @method render
     * @returns {Vocabs}
     */
    render: function() {
        this.renderTemplate();
        this.viewer.setElement('#vocab-container').render();
        return this;
    },
    /**
     * @method set
     * @param {String} [vocabId]
     */
    set: function(vocabId) {
        this.viewer.load(vocabId);
    },
    /**
     * @method remove
     * @returns {Vocabs}
     */
    remove: function() {
        this.viewer.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
