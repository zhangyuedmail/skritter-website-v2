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
            this.listenTo(app.dialogs, 'goal-settings:save', this.saveGoalSettings);
            this.listenTo(app.dialogs, 'goal-settings:show', this.renderGoalSettings);
            this.listenTo(app.user.data.stats, 'add change', this.renderDailyGoal);
            this.listenTo(app.user.data.stats, 'add change', this.renderAllTime);
            this.listenTo(app.user.data.vocablists, 'add change remove', this.renderListQueue);
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
            app.user.data.items.fetch();
            app.user.data.stats.fetch();
            app.user.data.vocablists.fetch();
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
            this.$('#items-reviewed .value').text(app.user.data.stats.getDailyItemsReviewed());
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
            var data = [];
            if (goal.type === 'items') {
                //TODO: pull doughnut data from stats
                var remaining = goal.value - app.user.data.items.getReviewedCount();
                remaining = remaining < 0 ? 0 : remaining;
                data = [
                    {label: "Completed", value: goal.value - remaining, color:'#c5da4b'},
                    {label: "Remaining", value: remaining, color: '#efeef3'}
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
         * @method renderGoalSettings
         * @param {jQuery} dialog
         */
        renderGoalSettings: function(dialog) {
            var goal = app.user.settings.getGoal();
            dialog.find('input[value="' + goal.type + '"]').prop('checked', true);
            dialog.find('#goal-value').val(goal.value);
        },
        /**
         * @method renderListDoughnut
         * @returns {DashboardPage}
         */
        renderListDoughnut: function() {
            var context = this.$('#list-queue-doughnut').get(0).getContext('2d');
            var progress = app.user.data.vocablists.getProgress();
            this.doughnutList = new Chart(context).Doughnut(
                [
                    {label: "Completed", value: progress, color:'#c5da4b'},
                    {label: "Remaining", value: 100 - progress, color: '#efeef3'}
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
                legend: [0, 50, 100, 200],
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
            this.renderListDoughnut();
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {},
        /**
         * @method saveGoalSettings
         * @param {jQuery} dialog
         */
        saveGoalSettings: function(dialog) {
            var goalType = dialog.find('input[name="goal-type"]:checked').val();
            var goalValue = dialog.find('#goal-value').val();
            app.user.settings.setGoal(goalType, goalValue);
            this.renderGoalDoughnut();
        },
        /**
         * @method updateHeatmap
         */
        updateHeatmap: function() {
            this.heatmap.update(app.user.data.stats.getHeatmapData());
        }
    });

    return DashboardPage;

});