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
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.renderTemplate(Template);
            this.listQueue.setElement(this.$('#list-queue-table')).render();
            this.renderListQueue();
            this.renderStats();
            return this;
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