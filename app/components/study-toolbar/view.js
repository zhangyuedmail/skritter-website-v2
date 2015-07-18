var GelatoComponent = require('gelato/component');

/**
 * @class StudyToolbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} [options]
     * @constructor
     */
    initialize: function(options) {
        options = options || {};
        this.listenTo(app.user.data.stats, 'fetch', this.updateTimeStudied);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/study-toolbar/template'),
    /**
     * @method render
     * @returns {StudyToolbar}
     */
    render: function() {
        this.renderTemplate();
        this.updateTimeStudied();
        app.user.data.stats.fetchDay();
        return this;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick ': 'handleClickButtonAdd'
    },
    /**
     * @method handleClickButtonAdd
     * @param {Event} event
     */
    handleClickButtonAdd: function(event) {
        event.preventDefault();
        app.user.data.items.fetchNew();
    },
    /**
     * @method updateTimeStudied
     */
    updateTimeStudied: function() {
        var timeStudied = app.user.data.stats.getDailyTimeStudied();
        this.$('#time-studied').text(app.fn.convertTimeToClock(timeStudied * 1000));
    }
});