var GelatoComponent = require('gelato/component');

/**
 * @class DashboardLists
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.vocablist = null;
        this.vocablists = this.createCollection('collections/vocablists');
        this.listenTo(this.vocablists, 'state', this.render);
        this.vocablists.fetch({
            data: {
                limit: 10,
                sort: 'adding',
                include_percent_done: 'true',
                lang: app.getLanguage()
            }
        });
    },
    /**
     * @property events
     * @type {Object} events
     */
    events: {
        'vclick .button-sections': 'handleClickVocablistSections',
        'vclick .button-show-lists': 'handleClickShowLists'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {DashboardStatus}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickVocablistSections
     * @param {Event} event
     */
    handleClickVocablistSections: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        var attributes = {id: $row.data('list-id')};
        this.vocablist = this.createModel('models/vocablist', attributes);
        this.listenToOnce(this.vocablist, 'state:standby', this.render);
        this.vocablist.fetch();
    },
    /**
     * @method handleClickShowLists
     * @param {Event} event
     */
    handleClickShowLists: function(event) {
        event.preventDefault();
        this.vocablist = null;
        this.listenToOnce(this.vocablist, 'state:standby', this.render);
        this.vocablists.fetch({
            data: {
                limit: 10,
                sort: 'adding',
                include_percent_done: 'true',
                lang: app.getLanguage()
            }
        });
    }
});
