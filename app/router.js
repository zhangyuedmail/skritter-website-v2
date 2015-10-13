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
        'vocab(/:vocabId)': 'navigateVocab',
        'vocablists': 'navigateVocablistQueue',
        'vocablists/browse': 'navigateVocablistBrowse',
        'vocablists/chinesepod': 'navigateChinesepod',
        'vocablists/queue': 'navigateVocablistQueue',
        'vocablists/published': 'navigateVocablistPublished',
        'vocablists/my-lists': 'navigateVocablistMyLists',
        'vocablists/create': 'navigateCreateVocablist',
        'vocablists/view/(:vocablistId)/(:sectionId)': 'navigateVocablistSection',
        'vocablists/view/(:vocablistId)': 'navigateVocablist',
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
            this.go('pages/billing-history');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountBillingSubscription
     */
    navigateAccountBillingSubscription: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/billing-subscription');
            this.go('pages/billing-subscription');
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
            this.go('pages/settings-general');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountSettingsStudy
     */
    navigateAccountSettingsStudy: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/settings-study');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateChinesepod
     */
    navigateChinesepod: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/chinesepod');
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
            this.go('pages/dashboard');
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
        this.go('pages/scratchpad').load(vocabId, part);
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
            this.go('pages/study').load(listId, sectionId);
        } else {
            this.navigateLogin();
        }
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
     * @method navigateVocablistBrowse
     */
    navigateVocablistBrowse: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablist-browse');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistQueue
     */
    navigateVocablistQueue: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablist-queue');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistMyLists
     */
    navigateVocablistMyLists: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablist-mine');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablist
     */
    navigateVocablist: function(vocablistId) {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablist', {vocablistId: vocablistId});
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistSection
     */
    navigateVocablistSection: function(vocablistId, sectionId) {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablist-section', {
                vocablistId: vocablistId,
                sectionId: sectionId
            });
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistPublished
     */
    navigateVocablistPublished: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablist-published');
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
