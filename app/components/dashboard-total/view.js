var GelatoComponent = require('gelato/modules/component');

/**
 * @class LearnedWords
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.listenTo(app.user.data.stats, 'fetch', this.update);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/dashboard-total/template'),
    /**
     * @method render
     * @returns {Component}
     */
    render: function() {
        this.renderTemplate();
        this.update();
        return this;
    },
    /**
     * @method update
     */
    update: function() {
        if (app.user.data.stats.length) {
            this.$('#characters-learned .value').text(app.user.data.stats.getAllTimeCharactersLearned());
            this.$('#words-learned .value').text(app.user.data.stats.getAllTimeWordsLearned());
        }
    }
});
