var Component = require('base/component');
var ProgressStats = require('collections/progress-stats');

/**
 * @class LearnedWords
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.stats = new ProgressStats();
        this.listenTo(this.stats, 'state:standby', this.update);
        this.stats.fetchToday();
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
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
        if (this.stats.length) {
            this.$('#characters-learned .value').text(this.stats.getAllTimeCharactersLearned());
            this.$('#words-learned .value').text(this.stats.getAllTimeWordsLearned());
        }
    }
});
