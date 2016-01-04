var Router = require('gelato/router');

/**
 * @class DefaultRouter
 * @extends {Router}
 */
module.exports = Router.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.on('route', this.handleRoute);
    },
    /**
     * @property routes
     * @type {Object}
     */
    routes: {
        '': 'defaultRoute',
        'account': 'navigateAccount',
        'account/billing/history': 'navigateAccountBillingHistory',
        'account/billing/subscription': 'navigateAccountBillingSubscription',
        'account/configure': 'navigateAccountConfigure',
        'account/settings/general': 'navigateAccountSettingsGeneral',
        'account/settings-general': 'navigateAccountSettingsGeneral', //LEGACY
        'account/settings/study': 'navigateAccountSettingsStudy',
        'account/settings-study': 'navigateAccountSettingsStudy', //LEGACY
        'contact': 'navigateContact',
        'dashboard': 'navigateDashboard',
        'features': 'navigateFeatures',
        'home': 'navigateHome',
        'institutions': 'navigateInstitutions',
        'legal': 'navigateLegal',
        'login': 'navigateLogin',
        'scratchpad/:vocabId(/:part)': 'navigateScratchpad',
        'signup': 'navigateSignup',
        'study(/:listId)(/:sectionId)': 'navigateStudy',
        'test': 'navigateTest',
        'vocab(/:vocabId)': 'navigateVocab',
        'vocablists': 'navigateVocablistsQueue',
        'vocablists/browse': 'navigateVocablistsBrowse',
        'vocablists/chinesepod': 'navigateVocablistsChinesepod',
        'vocablists/create': 'navigateVocablistsCreate',
        'vocablists/my-lists': 'navigateVocablistsMine',
        'vocablists/published': 'navigateVocablistsPublished',
        'vocablists/queue': 'navigateVocablistsQueue',
        'vocablists/view/(:vocablistId)(/:sectionId)': 'navigateVocablist',
        'words': 'navigateWordsAll',
        'words/all': 'navigateWordsAll',
        'words/banned': 'navigateWordsBanned',
        'words/mnemonics': 'navigateWordsMnemonics',
        'words/starred': 'navigateWordsStarred',
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
     * @method handleRoute
     */
    handleRoute: function() {
        if (window.ga) {
            ga('send', 'pageview', {
                page: document.location.pathname,
                title: this.page.title
            });
        }
    },
    /**
     * @method navigateAccount
     */
    navigateAccount: function() {
        if (app.user.isLoggedIn()) {
            this.navigateAccountSettingsGeneral();
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountBillingHistory
     */
    navigateAccountBillingHistory: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/billing/history');
            this.go('views/account/billing/history');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountBillingSubscription
     */
    navigateAccountBillingSubscription: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/billing/subscription');
            this.go('views/account/billing/subscription');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountConfigure
     */
    navigateAccountConfigure: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/configure');
            this.go('pages1/account/configure');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountSettingsGeneral
     */
    navigateAccountSettingsGeneral: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/settings/general');
            this.go('views/account/settings/general');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountSettingsStudy
     */
    navigateAccountSettingsStudy: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/settings/study');
            this.go('views/account/settings/study');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateCreateVocablist
     */
    navigateCreateVocablist: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablist-create');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateContact
     */
    navigateContact: function() {
        this.go('pages/contact');
    },
    /**
     * @method navigateDashboard
     */
    navigateDashboard: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('dashboard');
            this.go('pages1/dashboard');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateFeatures
     */
    navigateFeatures: function() {
        this.navigate('features');
        this.go('pages/features');
    },
    /**
     * @method navigateHome
     */
    navigateHome: function() {
        this.navigate('home');
        this.go('pages/home');
    },
    /**
     * @method navigateInstitutions
     */
    navigateInstitutions: function() {
        this.go('pages/institutions');
    },
    /**
     * @method navigateLegal
     */
    navigateLegal: function() {
        this.go('pages/legal');
    },
    /**
     * @method navigateLogin
     */
    navigateLogin: function() {
        if (app.user.isLoggedIn()) {
            this.navigateHome();
        } else {
            this.navigate('login');
            this.go('pages/login');
        }
    },
    /**
     * @method navigateNotFound
     */
    navigateNotFound: function() {
        this.navigate('not-found');
        this.go('pages/not-found');
    },
    /**
     * @method navigateScratchpad
     * @param {String} vocabId
     * @param {String} [part]
     */
    navigateScratchpad: function(vocabId, part) {
        this.go('pages1/scratchpad', {part: part, vocabId: vocabId});
    },
    /**
     * @method navigateSignup
     */
    navigateSignup: function() {
        this.navigate('signup');
        this.go('pages/signup');
    },
    /**
     * @method navigateStudy
     * @param {String} [listId]
     * @param {String} [sectionId]
     */
    navigateStudy: function(listId, sectionId) {
        if (app.user.isLoggedIn()) {
            if (sectionId) {
                this.go('pages/study-section', {listId: listId, sectionId: sectionId});
            } else if (listId) {
                this.go('pages/study-list', {listId: listId});
            } else {
                this.go('pages1/study');
            }
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateTest
     */
    navigateTest: function() {
        this.go('views/test');
    },
    /**
     * @method navigateVocab
     * @param {String} [vocabId]
     */
    navigateVocab: function(vocabId) {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocab').set(vocabId);
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablist
     * @param {String} listId
     * @param {String} [sectionId]
     */
    navigateVocablist: function(listId, sectionId) {
        if (app.user.isLoggedIn()) {
            if (sectionId) {
                this.go('views/vocablists/list/section', {vocablistId: listId, sectionId: sectionId});
            } else {
                this.go('views/vocablists/list', {vocablistId: listId});
            }
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsBrowse
     */
    navigateVocablistsBrowse: function() {
        if (app.user.isLoggedIn()) {
            this.go('views/vocablists/browse');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsChinesepod
     */
    navigateVocablistsChinesepod: function() {
        if (app.user.isLoggedIn()) {
            this.go('views/vocablists/chinesepod');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsCreate
     */
    navigateVocablistsCreate: function() {
        if (app.user.isLoggedIn()) {
            this.go('views/vocablists/create');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsMine
     */
    navigateVocablistsMine: function() {
        if (app.user.isLoggedIn()) {
            this.go('views/vocablists/mine');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsPublished
     */
    navigateVocablistsPublished: function() {
        if (app.user.isLoggedIn()) {
            this.go('views/vocablists/published');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsQueue
     */
    navigateVocablistsQueue: function() {
        if (app.user.isLoggedIn()) {
            this.go('views/vocablists/queue');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsAll
     */
    navigateWordsAll: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words-all');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsBanned
     */
    navigateWordsBanned: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words-banned');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsMnemonics
     */
    navigateWordsMnemonics: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words-mnemonics');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsStarred
     */
    navigateWordsStarred: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words-starred');
        } else {
            this.navigateLogin();
        }
    }
});
