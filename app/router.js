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
    'about': 'navigateAbout',
    'account': 'navigateAccount',
    'account/billing/history': 'navigateAccountBillingHistory',
    'account/billing/subscription': 'navigateAccountBillingSubscription',
    'account/settings/general': 'navigateAccountSettingsGeneral',
    'account/settings-general': 'navigateAccountSettingsGeneral', //LEGACY
    'account/settings/study': 'navigateAccountSettingsStudy',
    'account/settings-study': 'navigateAccountSettingsStudy', //LEGACY
    'account/setup': 'navigateAccountSetup',
    'contact': 'navigateContact',
    'dashboard': 'navigateDashboard',
    'demo': 'navigateDemo',
    'features': 'navigateFeatures',
    'home': 'navigateHome',
    'institutions': 'navigateInstitutions',
    'legal': 'navigateLegal',
    'login': 'navigateLogin',
    'password-reset': 'navigatePasswordReset',
    'scratchpad/:writing(/:part)': 'navigateScratchpad',
    'signup(/:plan)': 'navigateSignup',
    'stats': 'navigateStats',
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
   * TODO: remove this after application level dialogs implemented
   *
   * @method go
   * @param {String} path
   * @param {Object} [options]
   * @returns {GelatoPage}
   */
  go: function(path, options) {
    // close and remove page level dialogs
    if (this.page && this.page.dialog) {
      this.page.dialog.close();
    }
    // hack to remove bootstrap model backdrop
    $('.modal-backdrop').remove();
    return Router.prototype.go.call(this, path, options);
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
   * Navigates to the About Us page
   */
  navigateAbout: function() {
    this.navigate('about');
    this.go('pages/about');
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
            this.go('pages/account/billing/history');
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
            this.go('pages/account/billing/subscription');
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
            this.go('pages/account/settings/general');
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
            this.go('pages/account/settings/study');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateAccountSetup
     */
    navigateAccountSetup: function() {
        if (app.user.isLoggedIn()) {
            this.navigate('account/setup');
            this.go('pages/account/setup');
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
     * @method navigateDemo
     * @param {String} [lang]
     */
    navigateDemo: function(lang) {
        if (app.user.isLoggedIn()) {
            this.navigate('dashboard');
            this.go('pages/dashboard');
        } else {
            this.go('pages/demo');
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
     * @method navigatePasswordReset
     */
    navigatePasswordReset: function() {
        if (app.user.isLoggedIn()) {
            this.navigateHome();
        } else {
            this.navigate('password-reset');
            this.go('pages/password-reset');
        }
    },
    /**
     * @method navigateScratchpad
     * @param {String} writing
     * @param {String} [part]
     */
    navigateScratchpad: function(writing, part) {
        this.go('pages/scratchpad', {part: part, writing: writing});
    },
    /**
     * @method navigateSignup
     * @param {String} [plan]
     */
    navigateSignup: function(plan) {
        if (!app.user.isLoggedIn()) {
            this.navigate('signup');
            this.go('pages/signup', {plan: plan});
        } else {
            this.navigateDashboard();
        }
    },
    /**
     * @method navigateStats
     */
    navigateStats: function() {
      if (app.user.isLoggedIn()) {
        this.go('pages/stats');
      } else {
        this.navigateLogin();
      }
    },
    /**
     * @method navigateStudy
     * @param {String} [listId]
     * @param {String} [sectionId]
     */
    navigateStudy: function(listId, sectionId) {
      if (app.user.isLoggedIn()) {
        if (sectionId) {
          //TODO: replace when single list section study ready for action
          //this.go('pages/study-section', {listId: listId, sectionId: sectionId});
          this.go('pages/study');
        } else if (listId) {
          this.go('pages/study-list', {listId: listId});
        } else {
          this.go('pages/study');
        }
      } else {
        this.navigateLogin();
      }
    },
    /**
     * @method navigateTest
     */
    navigateTest: function() {
        this.go('pages/test');
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
                this.go('pages/vocablists/list-section', {vocablistId: listId, sectionId: sectionId});
            } else {
                this.go('pages/vocablists/list', {vocablistId: listId});
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
            this.go('pages/vocablists/browse');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsChinesepod
     */
    navigateVocablistsChinesepod: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablists/chinesepod');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsCreate
     */
    navigateVocablistsCreate: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablists/create');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsMine
     */
    navigateVocablistsMine: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablists/mine');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsPublished
     */
    navigateVocablistsPublished: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablists/published');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateVocablistsQueue
     */
    navigateVocablistsQueue: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/vocablists/queue');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsAll
     */
    navigateWordsAll: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words/all');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsBanned
     */
    navigateWordsBanned: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words/banned');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsMnemonics
     */
    navigateWordsMnemonics: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words/mnemonics');
        } else {
            this.navigateLogin();
        }
    },
    /**
     * @method navigateWordsStarred
     */
    navigateWordsStarred: function() {
        if (app.user.isLoggedIn()) {
            this.go('pages/words/starred');
        } else {
            this.navigateLogin();
        }
    }
});
