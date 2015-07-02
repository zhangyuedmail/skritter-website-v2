var GelatoPage = require('gelato/modules/page');
var GoalDoughnut = require('components/goal-doughnut/view');
var ItemsAdded = require('components/items-added/view');
var ItemsReviewed = require('components/items-reviewed/view');
var LearnedCharacters = require('components/learned-characters/view');
var LearnedWords = require('components/learned-words/view');
var MonthHeatmap = require('components/month-heatmap/view');
var MonthStreak = require('components/month-streak/view');

/**
 * @class Dashboard
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.goalDoughnut = new GoalDoughnut();
        this.itemsAdded = new ItemsAdded();
        this.itemsReviewed = new ItemsReviewed();
        this.learnedCharacters = new LearnedCharacters();
        this.learnedWords = new LearnedWords();
        this.monthHeatmap = new MonthHeatmap();
        this.monthStreak = new MonthStreak();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Dashboard - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/dashboard/template'),
    /**
     * @method render
     * @returns {Dashboard}
     */
    render: function() {
        this.renderTemplate();
        this.goalDoughnut.setElement('#goal-doughnut-container').render();
        this.itemsAdded.setElement('#items-added-container').render();
        this.itemsReviewed.setElement('#items-reviewed-container').render();
        this.learnedCharacters.setElement('#learned-characters-container').render();
        this.learnedWords.setElement('#learned-words-container').render();
        this.monthHeatmap.setElement('#month-heatmap-container').render();
        this.monthStreak.setElement('#month-streak-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {GelatoPage}
     */
    remove: function() {
        this.goalDoughnut.remove();
        this.itemsAdded.remove();
        this.itemsReviewed.remove();
        this.learnedCharacters.remove();
        this.learnedWords.remove();
        this.monthHeatmap.remove();
        this.monthStreak.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
