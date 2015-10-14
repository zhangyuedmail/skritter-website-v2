var GelatoComponent = require('gelato/component');
var ProgressStats = require('collections/progress-stats');
var StudyToolbarTimer = require('components/study-toolbar/timer/view');
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
        this.timer = new StudyToolbarTimer();
        this.listenTo(this.items, 'state', this.render);
        this.listenTo(this.stats, 'state:standby', this.updateTimerOffset);
        this.stats.fetchToday();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'click #button-add-item': 'handleClickAddItem',
        'click #button-list-settings': 'handleClickListSettings',
        'click #button-study-settings': 'handleClickStudySettings'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @function remove
     * @returns {StudyToolbar}
     */
    remove: function() {
      this.timer.remove();
      return this;
    },
    /**
     * @method render
     * @returns {StudyToolbar}
     */
    render: function() {
        this.renderTemplate();
        this.timer.setElement('#timer-container').render();
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
        dialog.on('save', _.bind(function(settings) {
            this.trigger('save:study-settings', settings);
            dialog.close();
        }, this));
        dialog.open();
    },
    /**
     * @method updateTimerOffset
     */
    updateTimerOffset: function(stats) {
        this.timer.setServerOffset(stats.getDailyTimeStudied());
    }
});
