/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/dashboard.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

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
            this.listenTo(app.user.data.items, 'download:complete', $.proxy(this.updateDownloadProgress, this));
            this.listenTo(app.user.data.items, 'download:update', $.proxy(this.updateDownloadProgress, this));
            this.listenTo(app.user.data.items, 'sort', $.proxy(this.updateDueCount, this));
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
            this.renderFields();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageDashboard}
         */
        renderFields: function() {
            this.$('.settings-name').text(app.user.settings.get('name'));
            this.toggleDownloadProgress();
            this.updateDueCount();
            this.$('.dial').knob();
            this.heatmap.init({
                animationDuration: 800,
                cellSize: 20,
                cellRadius: 25,
                cellPadding: 5,
                //data: "datas-years.json",
                displayLegend: false,
                domain: "month",
                domainDynamicDimension: false,
                domainMargin: 0,
                label: {
                    align: 'center',
                    position: 'top'
                },
                legend: [20, 40, 60, 80],
                //nextSelector: "#example-h-NextDomain-selector",
                //previousSelector: "#example-h-PreviousDomain-selector",
                range: 1,
                start: new Date(2000, 0, 5),
                subDomain: "x_day"
            });
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
         * @method toggleDownloadProgress
         * @returns {PageDashboard}
         */
        toggleDownloadProgress: function() {
            if (app.user.data.items.hasMissing()) {
                this.$('#download-progress').show();
            } else {
                this.$('#download-progress').hide();
            }
            return this;
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
        },
        /**
         * @method updateDueCount
         * @returns {PageDashboard}
         */
        updateDueCount: function() {
            var self = this;
            app.user.data.items.getDueCount(function(result) {
                self.$('.due-count').text(result);
            });
            return this;
        }
    });

    return PageDashboard;

});