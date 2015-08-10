var GelatoRouter = require('gelato/router');

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
        'settings/general': 'navigateSettingsGeneral',
        'settings/study': 'navigateSettingsStudy',
        'study(/:listId)(/:sectionId)': 'navigateStudy',
        'vocab(/:vocabId)': 'navigateVocab',
        'vocablist/browse': 'navigateVocablistBrowse',
        'vocablist/queue': 'navigateVocablistQueue',
        '': 'navigateHome',
        '*route': 'navigateNotFound'
    },
    /**
     * @method navigateDashboard
     */
    navigateDashboard: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/dashboard/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateHome
     */
    navigateHome: function() {
        //TODO: enable normal marketing routes after testing
        //this.page = new (require('pages/marketing-home/view'));
        //this.page.render();
        if (app.user.isLoggedIn()) {
            this.navigateDashboard();
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateLogin
     */
    navigateLogin: function() {
        if (app.user.isLoggedIn()) {
            this.navigateHome();
        } else {
            this.page = new (require('pages/login/view'));
            this.page.render();
        }
    },
    /**
     * @method navigateSettingsGeneral
     */
    navigateSettingsGeneral: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/settings-general/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateSettingsStudy
     */
    navigateSettingsStudy: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/settings-study/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateStudy
     * @param {String} [listId]
     * @param {String} [sectionId]
     */
    navigateStudy: function(listId, sectionId) {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/study/view'));
            this.page.render().load(listId, sectionId);
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateVocab
     * @param {String} [vocabId]
     */
    navigateVocab: function(vocabId) {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocab/view'));
            this.page.render().set(vocabId);
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateVocablistBrowse
     */
    navigateVocablistBrowse: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocablist-browse/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateVocablistQueue
     */
    navigateVocablistQueue: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocablist-queue/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateNotFound
     */
    navigateNotFound: function() {
        this.page = new (require('pages/not-found/view'));
        this.page.render();
    }
});
