var GelatoComponent = require('gelato/component');
var VocablistSettings = require('dialogs/vocablist-settings/view');
var VocablistRemoveDialog = require('dialogs/vocablist-remove/view');

/**
 * @class VocablistAddTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick .stop-adding-link': 'handleClickStopAddingLink',
        'vclick .list-settings-span': 'handleClickListSettingsSpan',
        'vclick .remove-list-span': 'handleClickRemoveListSpan'
    },
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        var throttledRender = _.throttle(_.bind(this.render, this));
        this.lists = [];
        this.listenTo(app.user.data.vocablists, 'all', throttledRender);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/vocablist-add-table/template'),
    /**
     * @method render
     * @returns {VocablistTable}
     */
    render: function() {
        this.update();
        this.renderTemplate();
        return this;
    },
    /**
     * @method update
     */
    update: function() {
        this.lists = app.user.data.vocablists.getAdding();
    },
    /**
     * @method handleClickStopAddingLink
     * @param {Event} e
     */
    handleClickStopAddingLink: function(e) {
        var listID = $(e.target).closest('.row').data('list-id');
        var list = _.find(this.lists, {id: listID.toString()});
        list.set('studyingMode', 'reviewing');
        list.save();
        this.render();
    },
    /**
     * @method handleClickListSettingsSpan
     * @param {Event} e
     */
    handleClickListSettingsSpan: function(e) {
        var listID = $(e.target).closest('.row').data('list-id');
        var list = _.find(this.lists, {id: listID.toString()});
        this.dialog = new VocablistSettings({vocablist: list});
        this.dialog.render().open();
    },
    /**
     * @method handleClickRemoveListSpan
     * @param {Event} e
     */
    handleClickRemoveListSpan: function(e) {
        var listID = $(e.target).closest('.row').data('list-id');
        var list = _.find(this.lists, {id: listID.toString()});
        this.dialog = new VocablistRemoveDialog({vocablist: list});
        this.dialog.render().open();
    }
});
