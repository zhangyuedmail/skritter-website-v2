/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseRouter
     * @extends Backbone.Router
     */
    return Backbone.Router.extend({
        /**
         * @property currentPage
         * @type BasePage
         */
        currentPage: undefined,
        /**
         * @method after
         */
        after: function() {
            if (this.currentPage) {
                if (this.currentPage.title) {
                    document.title = this.currentPage.title + " - " + app.strings.application.name;
                    this.currentPage.$('.navbar-title').text(this.currentPage.title);
                    if (app.analytics) {
                        app.analytics.trackView(this.currentPage.title);
                    }
                }
                this.currentPage.$("input[type='checkbox']").bootstrapSwitch();
            }
            if (app.dialogs && app.dialogs.isOpen()) {
                app.dialogs.hide();
            }
        },
        /**
         * @method back
         */
        back: function() {
            history.back();
        },
        /**
         * @method before
         */
        before: function() {
            if (app.sidebars && app.sidebars.isExpanded()) {
                app.sidebars.hide();
            }
            if (this.currentPage) {
                this.currentPage.remove();
            }
            this.currentPage = undefined;
        },
        /**
         * @method defaultRoute
         */
        defaultRoute: function() {
            this.navigate(app.isLocalhost() ? '/#' : '', {replace: true, trigger: true});
        },
        /**
         * @method switch
         * @param {String} page
         */
        switch: function(page) {
            this.before();
            this['show' + page]();
            this.after();
        }
    });
});