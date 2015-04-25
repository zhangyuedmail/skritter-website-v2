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
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
            this.listQueue = new ListTable({app: this.app});
            this.listenTo(this.app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(this.app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(this.app.user.data.stats, 'add change', this.renderStats);
            this.listenTo(this.app.user.data.vocablists, 'add change', this.renderListQueue);
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
            var addingLists = this.app.user.data.vocablists.getAdding();
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
            this.$('#characters-learned-value').text(this.app.user.data.stats.getTotalCharactersLearned());
            this.$('#items-added-value').text(this.app.user.data.items.getAddedCount());
            this.$('#items-reviewed-value').text(this.app.user.data.items.getReviewedCount());
            this.$('#month-streak-value').text(this.app.user.data.stats.getStreak());
            this.$('#words-learned-value').text(this.app.user.data.stats.getTotalWordsLearned());
            return this;
        }
    });

    return PageDashboard;

});