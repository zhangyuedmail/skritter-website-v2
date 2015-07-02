var GelatoComponent = require('gelato/modules/component');

/**
 * @class ItemsAdded
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.listenTo(app.user.data.items, 'update', this.updateItems);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/items-added/template'),
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
        this.$('.items-value').text(app.user.data.items.getAddedCount());
    }
});
