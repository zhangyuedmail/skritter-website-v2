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
            this.heatmap = new CalHeatMap();
            this.listQueue = new ListsTableComponent();
            this.listenTo(app.dialogs, 'feedback:show', this.handleFeedbackShow);
            this.listenTo(app.dialogs, 'feedback:submit', this.submitFeedback);
            this.listenTo(app.dialogs, 'goal-settings:save', this.saveGoalSettings);
            this.listenTo(app.dialogs, 'goal-settings:show', this.renderGoalSettings);
            this.listenTo(app.dialogs, 'logout-confirm:yes', app.user.logout);
            this.listenTo(app.user.data.stats, 'update', this.renderDailyGoal);
            this.listenTo(app.user.data.stats, 'update', this.renderAllTime);
            this.listenTo(app.user.data.vocablists, 'update', this.renderListQueue);
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
                var percentItems = app.user.data.stats.getGoalItemPercent();
                data = [
                    {value: percentItems, color:'#c5da4b'},
                    {value: 100 - percentItems, color: '#efeef3'}
                ];
            } else {
                var percentTime = app.user.data.stats.getGoalTimePercent();
                data = [
                    {value: percentTime, color:'#c5da4b'},
                    {value: 100 - percentTime, color: '#efeef3'}
                ];
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
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {},
        /**
         * @method handleFeedbackShow
         * @param {jQuery} dialog
         */
        handleFeedbackShow: function(dialog) {
            dialog.find('#contact-message').val('');
            dialog.find('.status-message').empty();
        },
        /**
         * @method saveGoalSettings
         * @param {jQuery} dialog
         */
        saveGoalSettings: function(dialog) {
            var goalType = dialog.find('input[name="goal-type"]:checked').val();
            var goalValue = dialog.find('#goal-value').val();
            app.user.settings.setGoal(goalType, goalValue);
            this.renderGoalDoughnut();
            app.dialogs.close();
        },
        /**
         * @method submitFeedback
         * @param {jQuery} dialog
         */
        submitFeedback: function(dialog) {
            var message = dialog.find('#contact-message').val();
            var subject = dialog.find('#contact-topic-select').val();
            console.log(message, subject);
            app.api.postContact('feedback', {
                custom: {page: 'Dashboard'},
                message: message,
                subject: subject
            }, function() {
                app.dialogs.close();
            }, function(error) {
                dialog.find('.status-message').removeClass();
                dialog.find('.status-message').addClass('text-danger');
                dialog.find('.status-message').text(JSON.stringify(error));
            });
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