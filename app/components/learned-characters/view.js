var GelatoComponent = require('gelato/modules/component');

/**
 * @class LearnedCharacters
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.listenTo(app.user.data.stats, 'update', this.updateLearned);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/learned-characters/template'),
    /**
     * @method render
     * @returns {Component}
     */
    render: function() {
        this.renderTemplate();
        this.updateLearned();
        return this;
    },
    /**
     * @method updateLearned
     */
    updateLearned: function() {
        this.$('.learned-value').text(app.user.data.stats.getAllTimeCharactersLearned());
    }
});
