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
        'dashboard': 'navigateDashboard',
        'login': 'navigateLogin',
        'study(/:listId)(/:sectionId)': 'navigateStudy',
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
    },
    /**
     * @method navigateStudy
     * @param {String} [listId]
     * @param {String} [sectionId]
     */
    navigateStudy: function(listId, sectionId) {
        this.page = new (require('pages/study/view'));
        this.page.render().load(listId, sectionId);
    }
});
