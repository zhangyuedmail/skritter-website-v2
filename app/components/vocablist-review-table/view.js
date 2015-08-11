var GelatoComponent = require('gelato/component');
var VocablistSettings = require('dialogs/vocablist-settings/view');

/**
 * @class VocablistReviewTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick .restart-adding-link': 'handleClickRestartAddingLink',
        'vclick .list-settings-span': 'handleClickListSettingsSpan'
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
    template: require('components/vocablist-review-table/template'),
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
        this.lists = app.user.data.vocablists.getReviewing();
    },
    /**
     * @method handleClickRestartAddingLink
     * @param {Event} e
     */
    handleClickRestartAddingLink: function(e) {
        var listID = $(e.target).closest('.row').data('list-id');
        var list = _.find(this.lists, {id: listID.toString()});
        list.set('studyingMode', 'adding');
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
    }
});
