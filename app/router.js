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
        '': 'defaultRoute',
        'contact': 'navigateContact',
        'dashboard': 'navigateDashboard',
        'features': 'navigateFeatures',
        'home': 'navigateHome',
        'institutions': 'navigateInstitutions',
        'legal': 'navigateLegal',
        'login': 'navigateLogin',
        'settings/general': 'navigateSettingsGeneral',
        'settings/study': 'navigateSettingsStudy',
        'signup': 'navigateSignup',
        'study(/:listId)(/:sectionId)': 'navigateStudy',
        'vocab(/:vocabId)': 'navigateVocab',
        'vocablist/browse': 'navigateVocablistBrowse',
        'vocablist/chinesepod': 'navigateChinesepod',
        'vocablist/queue': 'navigateVocablistQueue',
        'vocablist/my-lists': 'navigateVocablistMyLists',
        'vocablist/create': 'navigateCreateVocablist',
        'vocablist/view/(:vocablistId)/(:sectionId)': 'navigateVocablistSection',
        'vocablist/view/(:vocablistId)': 'navigateVocablist',
        '*route': 'navigateNotFound'
    },
    /**
     * @method defaultRoute
     */
    defaultRoute: function() {
        if (app.user.isLoggedIn()) {
            this.navigateDashboard();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateContact
     */
    navigateContact: function() {
        this.page = new (require('pages/contact/view'));
        this.page.render();
    },
    /**
     * @method navigateDashboard
     */
    navigateDashboard: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('dashboard');
            this.page = new (require('pages/dashboard/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateFeatures
     */
    navigateFeatures: function() {
        this.page = new (require('pages/features/view'));
        this.page.render();
    },
    /**
     * @method navigateHome
     */
    navigateHome: function() {
        this.navigate('home');
        this.page = new (require('pages/home/view'));
        this.page.render();
    },
    /**
     * @method navigateInstitutions
     */
    navigateInstitutions: function() {
        this.page = new (require('pages/institutions/view'));
        this.page.render();
    },
    /**
     * @method navigateLegal
     */
    navigateLegal: function() {
        this.page = new (require('pages/legal/view'));
        this.page.render();
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
     * @method navigateSignup
     */
    navigateSignup: function() {
        this.page = new (require('pages/signup/view'));
        this.page.render();
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
     * @method navigateVocablistMyLists
     */
    navigateVocablistMyLists: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocablist-mine/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateVocablist
     */
    navigateVocablist: function(vocablistId) {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocablist/view'))({
                vocablistId: vocablistId
            });
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateVocablistSection
     */
    navigateVocablistSection: function(vocablistId, sectionId) {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocablist-section/view'))({
                vocablistId: vocablistId,
                sectionId: sectionId
            });
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateChinesepod
     */
    navigateChinesepod: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/chinesepod/view'))();
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateCreateVocablist
     */
    navigateCreateVocablist: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocablist-create/view'))();
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
