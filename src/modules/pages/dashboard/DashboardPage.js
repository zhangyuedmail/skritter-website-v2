/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/dashboard/dashboard-template.html',
    'core/modules/GelatoPage',
    'modules/components/tables/lists/ListsTableComponent'
], function(
    Template,
    GelatoPage,
    ListsTableComponent
) {

    /**
     * @class DashboardPage
     * @extends GelatoPage
     */
    var DashboardPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.doughnutGoal = null;
            this.doughnutList = null;
            this.heatmap = new CalHeatMap();
            this.listQueue = new ListsTableComponent();
            this.listenTo(app.dialog, 'goal-settings:confirm', this.renderStats);
            this.listenTo(app.user.data.items, 'add change', this.renderListQueue);
            this.listenTo(app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(app.user.data.vocablists, 'add change', this.renderListQueue);
        },
        /**
         * @property title
         * @type String
         */
        title: 'Dashboard - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {DashboardPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.listQueue.setElement(this.$('#list-queue-table')).render();
            this.$('#section-expired').hide();
            this.renderHeatmap();
            this.renderGoalDoughnut();
            this.renderListDoughnut();
            this.renderListQueue();
            this.renderStats();
            return this;
        },
        /**
         * @method renderGoalDoughnut
         * @returns {DashboardPage}
         */
        renderGoalDoughnut: function() {
            var context = this.$('#goal-doughnut').get(0).getContext('2d');
            var goal = app.user.settings.getGoal();
            var goalType = Object.keys(goal)[0];
            var goalValue = goal[goalType];
            var data = [];
            if (goalType === 'items') {
                //TODO: pull doughnut data from stats
                var remaining = goalValue - app.user.data.items.getReviewedCount();
                remaining = remaining < 0 ? 0 : remaining;
                data = [
                    {value: goalValue - remaining, color:'#c5da4b'},
                    {value: remaining, color: '#efeef3'}
                ];
            } else {
                //TODO: display remaining goal based on time
            }
            this.doughnutGoal = new Chart(context).Doughnut(data,
                {
                    percentageInnerCutout : 80,
                    animateRotate : false
                }
            );
        },
        /**
         * @method renderListDoughnut
         * @returns {DashboardPage}
         */
        renderListDoughnut: function() {
            var context = this.$('#list-queue-doughnut').get(0).getContext('2d');
            this.doughnutList = new Chart(context).Doughnut(
                [
                    {value: 0, color:'#c5da4b'},
                    {value: 100, color: '#efeef3'}
                ],
                {
                    percentageInnerCutout : 80,
                    animateRotate : false
                }
            );
        },
        /**
         * @method renderHeatmap
         * @returns {DashboardPage}
         */
        renderHeatmap: function() {
            this.heatmap.init({
                cellSize: 25,
                cellPadding: 5,
                cellRadius: 25,
                domain: 'month',
                domainDynamicDimension: false,
                domainGutter: 20,
                itemSelector: '#heatmap-container',
                legend: [1, 50, 100, 200],
                range: 1,
                start: new Date(2015, new Date().getMonth(), 1),
                subDomain: 'x_day'
            });
            this.heatmap.update(app.user.data.stats.getHeatmapData());
            return this;
        },
        /**
         * @method renderListQueue
         * @returns {DashboardPage}
         */
        renderListQueue: function() {
            var addingLists = app.user.data.vocablists.getAdding();
            this.listQueue.set(addingLists, {
                name: 'Name',
                progress: 'Progress'
            });
            return this;
        },
        /**
         * @method renderStats
         * @returns {DashboardPage}
         */
        renderStats: function() {
            this.$('#characters-learned .value').text(app.user.data.stats.getTotalCharactersLearned());
            this.$('#items-added .value').text(app.user.data.items.getAddedCount());
            this.$('#items-reviewed .value').text(app.user.data.items.getReviewedCount());
            this.$('#month-streak .value').text(app.user.data.stats.getStreak());
            this.$('#words-learned .value').text(app.user.data.stats.getTotalWordsLearned());
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {
            'vclick #goal-settings-button': 'handleClickGoalSettings'
        },
        /**
         * @method handleClickGoalSettings
         * @param {Event} event
         */
        handleClickGoalSettings: function(event) {
            event.preventDefault();
            var goal = app.user.settings.getGoal();
            var goalType = Object.keys(goal)[0];
            var goalValue = goal[goalType];
            $('gelato-dialog [name="goal-type"][value="' + goalType + '"]').prop('checked', 'checked');
            $('gelato-dialog #goal-value').val(goalValue);
            app.dialogs.open('goal-settings');
        },
        /**
         * @method updateGoalSettings
         */
        updateGoalSettings: function() {
            var goalType = $('gelato-dialog [name="goal-type"]:checked').val();
            var goalValue = $('gelato-dialog #goal-value').val();
            app.user.settings.setGoal(goalType, goalValue);
            app.dialog.close();
        }
    });

    return DashboardPage;

});