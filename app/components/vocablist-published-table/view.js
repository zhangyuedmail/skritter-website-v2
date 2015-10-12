var GelatoComponent = require('gelato/component');
var Vocablists = require('collections/vocablists');

/**
 * @class VocablistPublishedTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @property events
     * @typeof {Object}
     */
    events: {
        'click .add-to-queue-link': 'handleClickAddToQueueLink',
        'click #load-more-btn': 'handleClickLoadMoreButton'
    },
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.vocablists = new Vocablists();
        this.listenTo(this.vocablists, 'state', this.render);
        this.vocablists.fetch({
            data: {
                limit: 20,
                sort: 'published',
                include_user_names: 'true',
                lang: app.getLanguage()
            }
        });
    },
    /**
     * @method render
     * @returns {VocablistPublishedTable}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
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
        vocablist.set('studyingMode', 'adding');
        vocablist.save();
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
                limit: 20,
                sort: 'published',
                include_user_names: 'true',
                lang: app.getLanguage()
            },
            remove: false
        });
        this.render();
    }
});
