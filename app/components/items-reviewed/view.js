var GelatoComponent = require('gelato/modules/component');

/**
 * @class ItemsReviewed
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.listenTo(app.user.data.stats, 'update', this.updateItems);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/items-reviewed/template'),
    /**
     * @method render
     * @returns {Component}
     */
    render: function() {
        this.renderTemplate();
        this.updateItems();
        return this;
    },
    /**
     * @method updateItems
     */
    updateItems: function() {
        this.$('.items-value').text(app.user.data.stats.getDailyItemsReviewed());
    }
});
