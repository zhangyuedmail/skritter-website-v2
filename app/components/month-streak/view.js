var GelatoComponent = require('gelato/modules/component');

/**
 * @class MonthStreak
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.listenTo(app.user.data.stats, 'update', this.updateStreak);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/month-streak/template'),
    /**
     * @method render
     * @returns {Component}
     */
    render: function() {
        this.renderTemplate();
        this.updateStreak();
        return this;
    },
    /**
     * @method updateStreak
     */
    updateStreak: function() {
        this.$('.streak-value').text(app.user.data.stats.getStreak());
    }
});
