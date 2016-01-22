var GelatoComponent = require('gelato/component');
var Vocablists = require('collections/vocablists');

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
        this.vocablists = new Vocablists();
        this.listenTo(this.vocablists, 'state', this.render);
        this.vocablists.fetch({
            data: {
                limit: 10,
                sort: 'custom',
                lang: app.getLanguage()
            }
        });
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
     * @param {Event} event
     */
    handleClickAddToQueueLink: function(event) {
        event.preventDefault();
        var listID = $(event.target).closest('.add-to-queue-link').data('vocablist-id');
        var vocablist = this.vocablists.get(listID);
        if (vocablist.get('studyingMode') !== 'not studying') {
            return;
        }
        vocablist.save({'studyingMode': 'adding'}, {patch: true});
        this.render();
    },
    /**
     * @method handleClickLoadMoreButton
     * @param {Event} event
     */
    handleClickLoadMoreButton: function(event) {
        event.preventDefault();
        if (!this.vocablists.cursor) {
            return;
        }
        this.vocablists.fetch({
            data: {
                cursor: this.vocablists.cursor,
                limit: 10,
                sort: 'custom',
                lang: app.getLanguage()
            },
            remove: false
        });
        this.render();
    }
});
