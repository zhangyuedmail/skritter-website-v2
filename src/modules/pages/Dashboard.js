/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/dashboard.html',
    'core/modules/GelatoPage',
    'modules/components/ListTable'
], function(Template, GelatoPage, ListTable) {

    /**
     * @class PageDashboard
     * @extends GelatoPage
     */
    var PageDashboard = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.doughnutGoal = null;
            this.listQueue = new ListTable();
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
         * @returns {PageDashboard}
         */
        render: function() {
            this.renderTemplate(Template);
            this.listQueue.setElement(this.$('#list-queue-table')).render();
            this.renderGoalDoughnut();
            this.renderListQueue();
            this.renderStats();
            return this;
        },
        /**
         * @method renderGoalDoughnut
         * @returns {PageDashboard}
         */
        renderGoalDoughnut: function() {
            var context = this.$('#goal-doughnut').get(0).getContext('2d');
            this.doughnutGoal = new Chart(context).Doughnut(
                [
                    {
                        value: 60,
                        color:"#F7464A",
                        highlight: "#FF5A5E",
                        label: "Red"
                    },
                    {
                        value: 40,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",
                        label: "Green"
                    }
                ],
                {
                    //Boolean - Whether we should show a stroke on each segment
                    segmentShowStroke : true,

                    //String - The colour of each segment stroke
                    segmentStrokeColor : "#fff",

                    //Number - The width of each segment stroke
                    segmentStrokeWidth : 2,

                    //Number - The percentage of the chart that we cut out of the middle
                    percentageInnerCutout : 80, // This is 0 for Pie charts

                    //Number - Amount of animation steps
                    animationSteps : 100,

                    //String - Animation easing effect
                    animationEasing : "easeOutBounce",

                    //Boolean - Whether we animate the rotation of the Doughnut
                    animateRotate : true,

                    //Boolean - Whether we animate scaling the Doughnut from the centre
                    animateScale : false,

                    //String - A legend template
                    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

                }
            );
        },
        /**
         * @method renderListQueue
         * @returns {PageDashboard}
         */
        renderListQueue: function() {
            var addingLists = app.user.data.vocablists.getAdding();
            this.listQueue.set(addingLists, {
                name: 'Name',
                progress: 'Progress',
                status: 'Status'
            });
            return this;
        },
        /**
         * @method renderStats
         * @returns {PageDashboard}
         */
        renderStats: function() {
            this.$('#characters-learned-value').text(app.user.data.stats.getTotalCharactersLearned());
            this.$('#items-added-value').text(app.user.data.items.getAddedCount());
            this.$('#items-reviewed-value').text(app.user.data.items.getReviewedCount());
            this.$('#month-streak-value').text(app.user.data.stats.getStreak());
            this.$('#words-learned-value').text(app.user.data.stats.getTotalWordsLearned());
            return this;
        }
    });

    return PageDashboard;

});