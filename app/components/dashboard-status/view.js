var Component = require('base/component');

/**
 * @class DashboardStatus
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.dueCount = null;
        this.updateDueCount();
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {DashboardStatus}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method updateDueCount
     */
    updateDueCount: function() {
        $.ajax({
            context: this,
            headers: app.user.session.getHeaders(),
            type: 'GET',
            url: app.getApiUrl() + 'items/due',
            error: function(error) {
                console.error('DUE COUNT ERROR:', error);
            },
            success: function(result) {
                this.dueCount = 0;
                for (var part in result.due) {
                    for (var style in result.due[part]) {
                        this.dueCount += result.due[part][style];
                    }
                }
                this.render();
            }
        });
    }
});
