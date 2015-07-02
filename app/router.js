var GelatoRouter = require('gelato/modules/router');

/**
 * @class Router
 * @extends {GelatoRouter}
 */
module.exports = GelatoRouter.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property routes
     * @type {Object}
     */
    routes: {
        '': 'navigateHome',
        'dashboard': 'navigateDashboard',
        'login': 'navigateLogin',
        '*route': 'navigateHome'
    },
    /**
     * @method navigateDashboard
     */
    navigateDashboard: function() {
        this.page = new (require('pages/dashboard/view'));
        this.page.render();
    },
    /**
     * @method navigateHome
     */
    navigateHome: function() {
        this.page = new (require('pages/marketing-home/view'));
        this.page.render();
    }
});
