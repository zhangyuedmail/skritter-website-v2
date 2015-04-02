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
            this.heatmap = new CalHeatMap();
            this.lists = [];
            this.tableLists = new TableViewer();
            this.listenTo(app.user.data.items, 'download:complete', $.proxy(this.updateDownloadProgress, this));
            this.listenTo(app.user.data.items, 'download:update', $.proxy(this.updateDownloadProgress, this));
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.dashboard.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageDashboard}
         */
        render: function() {
            this.renderTemplate(Template);
            this.tableLists.setElement(this.$('.progress-table-container')).render();
            this.renderDialog();
            this.renderFields();
            this.renderHeatmap();
            this.load();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageDashboard}
         */
        renderFields: function() {
            if (app.user.data.items.hasMissing()) {
                this.$('#download-progress').show();
            } else {
                this.$('#download-progress').hide();
            }
            return this;
        },
        /**
         * @method renderHeatmap
         * @returns {PageDashboard}
         */
        renderHeatmap: function() {
            this.heatmap.init({
                cellRadius: 25,
                cellSize: 25,
                cellPadding: 5,
                //data: 'datas-years.json',
                domain: 'month',
                domainDynamicDimension: false,
                domainGutter: 20,
                itemSelector: '.heatmap-container',
                legend: [20, 40, 60, 80],
                range: 1,
                start: new Date(2015, 3, 1),
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
            this.tableLists.set(this.lists, {
                name: {title: '', type: 'text'},
                progress: {title: '', type: 'progress'},
                studyingMode: {title: '', type: 'text'},
                addToQueue: {title: '', type: 'link', linkText: "<i class='fa fa-close'></i>"}
            }, {showHeaders: false}).sortBy('name');
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick #confirm-logout': 'handleClickConfirmLogout'
        },
        /**
         * @method handleClickConfirmLogout
         * @param {Event} event
         */
        handleClickConfirmLogout: function(event) {
            event.preventDefault();
            app.user.logout();
        },
        /**
         * @method load
         * @returns {PageDashboard}
         */
        load: function() {
            var self = this;
            app.api.fetchVocabLists({sort: 'studying'}, function(result) {
                self.lists = result.VocabLists || [];
                self.renderTables();
            }, function(error) {
                console.log(error);
            });
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
            }
        }
    });

    return PageDashboard;

});