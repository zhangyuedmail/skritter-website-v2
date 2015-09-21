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
        'vocablists/browse': 'navigateVocablistBrowse',
        'vocablists/chinesepod': 'navigateChinesepod',
        'vocablists/queue': 'navigateVocablistQueue',
        'vocablists/published': 'navigateVocablistPublished',
        'vocablists/my-lists': 'navigateVocablistMyLists',
        'vocablists/create': 'navigateCreateVocablist',
        'vocablists/view/(:vocablistId)/(:sectionId)': 'navigateVocablistSection',
        'vocablists/view/(:vocablistId)': 'navigateVocablist',
        'words/all': 'navigateAllWords',
        'words/banned': 'navigateBannedWords',
        'words/mnemonics': 'navigateMnemonics',
        'words/starred': 'navigateStarredWords',
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
     * @method navigateAccount
     */
    navigateAccount: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/settings/general');
            this.navigateAccountSettingsGeneral();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateAccountBillingHistory
     */
    navigateAccountBillingHistory: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/billing-history/view'))();
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateAccountBillingSubscription
     */
    navigateAccountBillingSubscription: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/billing-subscription/view'))();
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateAccountSettingsGeneral
     */
    navigateAccountSettingsGeneral: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/settings-general/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateAccountSettingsStudy
     */
    navigateAccountSettingsStudy: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/settings-study/view'));
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateAllWords
     */
    navigateAllWords: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/words-all/view'))();
            this.page.render();
        } else {
            this.navigateHome();
        }
    },
    /**
     * @method navigateBannedWords
     */
    navigateBannedWords: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/words-banned/view'))();
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
     * @method navigateMnemonics
     */
    navigateMnemonics: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/words-mnemonics/view'))();
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
    },
    /**
     * @method navigateScratchpad
     * @param {String} vocabId
     * @param {String} [part]
     */
    navigateScratchpad: function(vocabId, part) {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/scratchpad/view'));
            this.page.render().load(vocabId, part);
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
     * @method navigateStarredWords
     */
    navigateStarredWords: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/words-starred/view'))();
            this.page.render();
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
     * @method navigateVocablistPublished
     */
    navigateVocablistPublished: function() {
        if (app.user.isLoggedIn()) {
            this.page = new (require('pages/vocablist-published/view'))();
            this.page.render();
        } else {
            this.navigateHome();
        }
    }
});
