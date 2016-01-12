var GelatoComponent = require('gelato/component');

/**
 * @class DashboardStatus
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
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
        var self = this;
        var count = 0;
        var lang = app.getLanguage();
        var now = moment().unix();
        var parts = app.user.getFilteredParts();
        var styles = app.user.getFilteredStyles();
        app.db.items
            .where('next')
            .belowOrEqual(now)
            .toArray()
            .then(function(items) {
                items.forEach(function(item) {
                    if (!item.vocabIds.length) {
                        return;
                    } else if (item.lang !== lang) {
                        return
                    } else if (parts.indexOf(item.part) === -1) {
                        return;
                    } else if (styles.indexOf(item.style) === -1) {
                        return;
                    }
                    if (!item.last) {
                        count++;
                        return;
                    }
                    var readiness = (now - item.last) / (item.next - item.last);
                    if (readiness >= 1.0) {
                        count++;
                    }
                });
                self.dueCount = count;
                self.render();
            });
    }
});
