var GelatoComponent = require('gelato/component');
var MyVocablists = require('./vocablists');

/**
 * @class VocablistMineTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.vocablists = new MyVocablists();
        this.listenTo(this.vocablists, 'sync', this.render);
        this.fetchOptions = {
            headers: { 'Authorization': 'bearer '+app.api.getToken() },
            data: {
                limit: 10,
                sort: 'custom'
            }
        };
        this.vocablists.fetch(this.fetchOptions);
    },
    /**
     * @property events
     * @typeof {Object}
     */
    events: {
        'vclick #load-more-btn': 'handleClickLoadMoreButton',
        'vclick .add-to-queue-link': 'handleClickAddToQueueLink'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistMineTable}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickAddToQueueLink
     * @param {Event} e
     */
    handleClickAddToQueueLink: function(e) {
        var listID = $(e.target).closest('.add-to-queue-link').data('vocablist-id');
        var vocablist = this.vocablists.get(listID);
        if (vocablist.get('studyingMode') !== 'not studying')
            return;

        vocablist.set('studyingMode', 'adding');
        vocablist.save();
        this.render();
    },
    /**
     * @method handleClickLoadMoreButton
     * @param {Event} e
     */
    handleClickLoadMoreButton: function(e) {
        if (!this.vocablists.cursor) {
            return;
        }
        var moreVocabLists = new MyVocablists();
        this.fetchOptions.data.cursor = this.vocablists.cursor;
        this.fetchingMore = true;
        this.listenToOnce(moreVocabLists, 'sync', function() {
            this.vocablists.cursor = moreVocabLists.cursor;
            this.vocablists.add(moreVocabLists.slice());
            this.fetchingMore = false;
            this.render();
        });
        moreVocabLists.fetch(this.fetchOptions);
        this.render();
    }
});
