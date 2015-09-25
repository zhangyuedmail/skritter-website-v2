var GelatoComponent = require('gelato/component');
var ProgressStats = require('collections/progress-stats');
var ListSettingsDialog = require('dialogs/list-settings/view');
var StudySettingsDialog = require('dialogs/study-settings/view');

/**
 * @class StudyToolbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.items = options.items;
        this.stats = new ProgressStats();
        this.listenTo(this.items, 'state', this.render);
        this.listenTo(this.stats, 'state', this.render);
        this.stats.fetchToday();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-add-item': 'handleClickAddItem',
        'vclick #button-list-settings': 'handleClickListSettings',
        'vclick #button-study-settings': 'handleClickStudySettings'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyToolbar}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickAddItem
     * @param {Event} event
     */
    handleClickAddItem: function(event) {
        event.preventDefault();
        this.trigger('click:add-item');
    },
    /**
     * @method handleClickStudySettings
     * @param {Event} event
     */
    handleClickListSettings: function(event) {
        event.preventDefault();
        this.trigger('click:list-settings');
        var dialog = new ListSettingsDialog();
        dialog.open();
    },
    /**
     * @method handleClickStudySettings
     * @param {Event} event
     */
    handleClickStudySettings: function(event) {
        event.preventDefault();
        this.trigger('click:study-settings');
        var dialog = new StudySettingsDialog();
        dialog.open();
    }
});
