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
            this.renderDialog();
            this.renderFields();
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