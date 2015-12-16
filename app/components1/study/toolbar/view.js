var GelatoComponent = require('gelato/component');

var ProgressStats = require('collections/progress-stats');
var StudySettings = require('dialogs/study-settings/view');
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
        this.page.items.addItems(
            null,
            function(result) {
                var added = result.numVocabsAdded;
                $.notify(
                    {
                        title: 'Update',
                        message: added + (added > 1 ? ' words have ' : ' word has ')  + 'been added.'
                    },
                    {
                        type: 'pastel-info',
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        delay: 5000,
                        icon_type: 'class'
                    }
                );
            }
        );
    },
    /**
     * @method handleClickStudySettings
     * @param {Event} event
     */
    handleClickStudySettings: function(event) {
        event.preventDefault();
        var dialog = new StudySettings();
        dialog.on('save', _.bind(function(settings) {
            this.page.items.reset();
            this.page.prompt.reset();
            app.user.set(settings, {merge: true}).cache();
            app.user.save();
            this.page.loadMore(
                _.bind(function() {
                    this.page.next();
                    dialog.close();
                }, this),
                _.bind(function() {
                    this.page.next();
                    dialog.close();
                }, this)
            );
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
