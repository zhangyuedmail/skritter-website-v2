var GelatoPage = require('gelato/page');
var VocablistAddTable = require('components/vocablist-add-table/view');
var VocablistReviewTable = require('components/vocablist-review-table/view');

/**
 * @class VocablistQueue
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.addingTable = new VocablistAddTable();
        this.reviewingTable = new VocablistReviewTable();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Queue - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/vocablist-queue/template'),
    /**
     * @method render
     * @returns {VocablistQueue}
     */
    render: function() {
        this.renderTemplate();
        this.addingTable.setElement('#adding-container').render();
        this.reviewingTable.setElement('#reviewing-container').render();
        app.user.data.vocablists.fetch();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistQueue}
     */
    remove: function() {
        this.addingTable.remove();
        this.reviewingTable.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
