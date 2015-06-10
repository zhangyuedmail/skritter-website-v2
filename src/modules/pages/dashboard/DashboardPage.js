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
            this.listenTo(app.user.data.items, 'add change', this.renderDailyGoal);
            this.listenTo(app.user.data.stats, 'add change', this.renderAllTime);
            this.listenTo(app.user.data.stats, 'add change', this.renderAllTime);
            this.listenTo(app.user.data.stats, 'add change', this.renderAllTime);
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
            this.renderAllTime();
            this.renderDailyGoal();
            this.renderListQueue();
            return this;
        },
        /**
         * @method renderAllTime
         * @returns {DashboardPage}
         */
        renderAllTime: function() {
            this.$('#characters-learned .value').text(app.user.data.stats.getTotalCharactersLearned());
            this.$('#month-streak .value').text(app.user.data.stats.getStreak());
            this.$('#words-learned .value').text(app.user.data.stats.getTotalWordsLearned());
            this.updateHeatmap();
            return this;
        },
        /**
         * @method renderDailyGoal
         * @returns {DashboardPage}
         */
        renderDailyGoal: function() {
            this.$('#items-added .value').text(app.user.data.items.getAddedCount());
            this.$('#items-reviewed .value').text(app.user.data.items.getReviewedCount());
            this.renderGoalDoughnut();
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
            this.updateHeatmap();
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
            //this.renderListDoughnut();
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {},
        /**
         * @method updateHeatmap
         */
        updateHeatmap: function() {
            this.heatmap.update(app.user.data.stats.getHeatmapData());
        }
    });

    return DashboardPage;

});