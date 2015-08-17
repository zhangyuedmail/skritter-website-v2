var GelatoComponent = require('gelato/component');
var Vocablists = require('collections/vocablists');
var VocablistSettings = require('dialogs/vocablist-settings/view');
var VocablistRemoveDialog = require('dialogs/vocablist-remove/view');

/**
 * @class VocablistReviewTable
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
                sort: 'studying'
            }
        });
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick .restart-adding-link': 'handleClickRestartAddingLink',
        'vclick .list-settings-span': 'handleClickListSettingsSpan',
        'vclick .remove-list-span': 'handleClickRemoveListSpan'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistTable}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickRestartAddingLink
     * @param {Event} event
     */
    handleClickRestartAddingLink: function(event) {
        var listID = $(event.target).closest('.row').data('list-id');
        var list = _.find(this.vocablists, {id: listID.toString()});
        list.set('studyingMode', 'adding');
        list.save();
        this.render();
    },
    /**
     * @method handleClickListSettingsSpan
     * @param {Event} event
     */
    handleClickListSettingsSpan: function(event) {
        var listID = $(event.target).closest('.row').data('list-id');
        var list = _.find(this.vocablists, {id: listID.toString()});
        this.dialog = new VocablistSettings({vocablist: list});
        this.dialog.render().open();
    },
    /**
     * @method handleClickRemoveListSpan
     * @param {Event} event
     */
    handleClickRemoveListSpan: function(event) {
        var listID = $(event.target).closest('.row').data('list-id');
        var list = _.find(this.vocablists, {id: listID.toString()});
        this.dialog = new VocablistRemoveDialog({vocablist: list});
        this.dialog.render().open();
    }
});
