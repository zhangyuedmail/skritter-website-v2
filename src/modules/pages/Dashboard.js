/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/dashboard.html',
    'core/modules/GelatoPage',
    'modules/components/TableViewer'
], function(Template, GelatoPage, TableViewer) {

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
            this.donutDailyGoal = null;
            this.donutListQueue = null;
            this.heatmap = new CalHeatMap();
            this.tableLists = new TableViewer();
            this.listenTo(app.dialog, 'logout:confirm', $.proxy(this.handleDialogLogoutConfirm, this));
            this.listenTo(app.user.data.items, 'download:complete download:update', $.proxy(this.updateDownloadProgress, this));
            this.listenTo(app.user.data.stats, 'add change', $.proxy(this.renderFields, this));
            this.listenTo(app.user.data.vocablists, 'add change', $.proxy(this.renderTables, this));
        },
        /**
         * @property title
         * @type String
         */
        title: i18n.dashboard.title + ' - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.renderTemplate(Template);
            this.tableLists.setElement(this.$('.progress-table-container')).render();
            this.renderDonuts();
            this.renderFields();
            this.renderHeatmap();
            this.renderTables();
            return this;
        },
        /**
         * @method renderDonuts
         * @returns {PageDashboard}
         */
        renderDonuts: function() {
            var contextDailyGoal = this.$('.daily-goal-donut-container').get(0).getContext('2d');
            var contextListQueue = this.$('.list-queue-donut-container').get(0).getContext('2d');
            this.donutDailyGoal = new Chart(contextDailyGoal).Doughnut([
                {value: 80, color:'#c5da4b'},
                {value: 20, color:'#efeef3'}
            ], {
                animateRotate: false,
                percentageInnerCutout : 80
            });
            this.donutListQueue = new Chart(contextListQueue).Doughnut([
                {value: 50, color:'#c5da4b'},
                {value: 50, color:'#efeef3'}
            ], {
                animateRotate: false,
                percentageInnerCutout : 80
            });
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageDashboard}
         */
        renderFields: function() {
            this.$('.characters-learned-count').text(app.user.data.stats.getTotalCharactersLearned());
            this.$('.words-learned-count').text(app.user.data.stats.getTotalWordsLearned());
            return this;
        },
        /**
         * @method renderHeatmap
         * @returns {PageDashboard}
         */
        renderHeatmap: function() {
            this.heatmap.init({
                cellSize: 25,
                cellPadding: 5,
                cellRadius: 25,
                domain: 'month',
                domainDynamicDimension: false,
                domainGutter: 20,
                itemSelector: '.heatmap-container',
                legend: [1, 50, 100, 200],
                range: 1,
                start: new Date(2015, new Date().getMonth(), 1),
                subDomain: 'x_day',
                subDomainTextFormat: '%d'
            });
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageDashboard}
         */
        renderTables: function() {
            var addingLists = app.user.data.vocablists.getAdding();
            this.tableLists.set(addingLists, {
                name: {title: '', type: 'row'},
                progress: {title: '', type: 'progress'}
            }, {showHeaders: false}).sortBy('name');
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .table .field-name': 'handleClickTableRow'
        },
        /**
         * @method handleClickTableRow
         * @param {Event} event
         */
        handleClickTableRow: function(event) {
            event.preventDefault();
            var listId = $(event.currentTarget).parent().attr('id').replace('row-', '');
            app.router.navigate('lists/browse/' + listId, {trigger: true});
        },
        /**
         * @method handleDialogLogoutConfirm
         * @param {Event} event
         */
        handleDialogLogoutConfirm: function(event) {
            event.preventDefault();
            app.user.logout();
        },
        /**
         * @method updateDownloadProgress
         * @param {Number} status
         */
        updateDownloadProgress: function(status) {
            this.$('#download-progress .progress-bar').attr('aria-valuenow', status);
            this.$('#download-progress .progress-bar').css('width', status + '%');
            this.$('#download-progress .progress-bar .sr-only').text(status + '% Complete');
            this.$('#download-progress .progress-status').text(status);
            if (status === 100) {
                this.$('#download-progress').fadeOut(1000);
            } else {
                this.$('#download-progress').show();
            }
        }
    });

    return PageDashboard;

});