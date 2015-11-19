var GelatoComponent = require('gelato/component');
var VocablistSettings = require('dialogs/vocablist-settings/view');
var VocablistRemoveDialog = require('dialogs/vocablist-remove/view');

/**
 * @class VocablistAddTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.vocablists = options.vocablists;
        this.listenTo(this.vocablists, 'state', this.render);
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick .stop-adding-link': 'handleClickStopAddingLink',
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
     * @method handleClickStopAddingLink
     * @param {Event} event
     */
    handleClickStopAddingLink: function(event) {
        event.preventDefault();
        var listID = $(event.target).closest('.row').data('list-id');
        var list = this.vocablists.get(listID.toString());
        list.save({'studyingMode': 'reviewing'}, {patch: true});
        this.render();
    },
    /**
     * @method handleClickListSettingsSpan
     * @param {Event} event
     */
    handleClickListSettingsSpan: function(event) {
        event.preventDefault();
        var listID = $(event.target).closest('.row').data('list-id');
        var list = this.vocablists.get(listID.toString());
        this.dialog = new VocablistSettings({vocablist: list});
        this.dialog.render().open();
    },
    /**
     * @method handleClickRemoveListSpan
     * @param {Event} event
     */
    handleClickRemoveListSpan: function(event) {
        event.preventDefault();
        var listID = $(event.target).closest('.row').data('list-id');
        var list = this.vocablists.get(listID.toString());
        this.dialog = new VocablistRemoveDialog({vocablist: list});
        this.dialog.render().open();
    }
});
