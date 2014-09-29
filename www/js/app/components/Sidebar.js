/**
 * @module Application
 */
define([
    "framework/GelatoSidebar"
], function(GelatoSidebar) {
    /**
     * @class Dialog
     * @extends GelatoSidebar
     */
    return GelatoSidebar.extend({
        /**
         * @method events
         * @returns {Object}
         */
        events: function(){
            return _.extend({}, GelatoSidebar.prototype.events, {
                "vclick .button-sidebar-logout": "handleClickLogout"
            });
        },
        /**
         * @method handleClickLogout
         * @param {Event} event
         */
        handleClickLogout: function(event) {
            event.preventDefault();
            app.user.logout();
        }
    });
});
