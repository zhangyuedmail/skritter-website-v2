var GelatoComponent = require('gelato/component');

var ProgressStats = require('collections/progress-stats');
var Timer = require('components1/study/toolbar/timer/view');

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
        this.page = options.page;
        this.stats = new ProgressStats();
        this.timer = new Timer();
        this.listenTo(this.stats, 'state:standby', this.updateTimerOffset);
        this.stats.fetchToday();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-add-item': 'handleClickAddItem',
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
     * @function remove
     * @returns {StudyToolbar}
     */
    remove: function() {
        this.timer.remove();
        return this;
    },
    /**
     * @method updateTimerOffset
     */
    updateTimerOffset: function(stats) {
        this.timer.setServerOffset(stats.getDailyTimeStudied());
    }
});
