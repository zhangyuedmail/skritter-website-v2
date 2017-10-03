let Router = require('gelato/router');

/**
 * @class DefaultRouter
 * @extends {Router}
 */
module.exports = Router.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
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
    'account/settings-general': 'navigateAccountSettingsGeneral', // LEGACY
    'account/settings/study': 'navigateAccountSettingsStudy',
    'account/settings-study': 'navigateAccountSettingsStudy', // LEGACY
    'account/setup': 'navigateAccountSetup',
    'admin': 'navigateAdmin',
    'contact': 'navigateContact',
    'dashboard': 'navigateDashboard',
    'demo': 'navigateDemo',
    'discourse/login': 'navigateDiscourseLogin',
    'features': 'navigateFeatures',
    'home': 'navigateHome',
    'institutions': 'navigateInstitutions',
    'legal': 'navigateLegal',
    'login': 'navigateLogin',
    'logout': 'navigateLogout',
    'mail/unsubscribe': 'navigateMailUnsubscribe',
    'password-reset': 'navigatePasswordReset',
    'refer': 'navigateUserReferralInfo',
    'refer/:userId': 'navigateApplyUserReferral',
    'scratchpad/:writing(/:part)': 'navigateScratchpad',
    'signup(/:plan)': 'navigateSignup',
    'stats': 'navigateStats',
    'study(/:listId)(/:sectionId)': 'navigateStudy',
    'sync-status': 'navigateSyncStatus',
    'test': 'navigateTest',
    'turkish': 'navigateTurkish',
    'vocab(/:vocabId)': 'navigateVocab',
    'vocablists': 'navigateVocablistsQueue',
    'vocablists/browse': 'navigateVocablistsBrowse',
    'vocablists/chinesepod': 'navigateVocablistsChinesepod',
    'vocablists/create': 'navigateVocablistsCreate',
    'vocablists/deleted': 'navigateVocablistsDeleted',
    'vocablists/my-lists': 'navigateVocablistsMine',
    'vocablists/published': 'navigateVocablistsPublished',
    'vocablists/queue': 'navigateVocablistsQueue',
    'vocablists/view/(:vocablistId)(/:sectionId)': 'navigateVocablist',
    'words': 'navigateWordsAll',
    'words/all': 'navigateWordsAll',
    'words/banned': 'navigateWordsBanned',
    'words/mnemonics': 'navigateWordsMnemonics',
    'words/starred': 'navigateWordsStarred',
    '*route': 'navigateNotFound',
  },

  /**
   * @method defaultRoute
   */
  defaultRoute: function () {
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
  go: function (path, options) {
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
  handleRoute: function () {
    if (window.ga && this.page) {
      ga('set', 'page', document.location.pathname);
      ga('send', 'pageview');
    }
  },

  /**
   * Navigates to the About Us page
   */
  navigateAbout: function () {
    this.navigate('about');
    this.go('pages/about/AboutPage');
  },

  /**
   * @method navigateAccount
   */
  navigateAccount: function () {
    if (app.user.isLoggedIn()) {
      this.navigateAccountSettingsGeneral();
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateAccountBillingHistory
   */
  navigateAccountBillingHistory: function () {
    if (app.user.isLoggedIn()) {
      this.navigate('account/billing/history');
      this.go('pages/account/AccountBillingHistoryPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateAccountBillingSubscription
   */
  navigateAccountBillingSubscription: function () {
    if (app.user.isLoggedIn()) {
      this.navigate('account/billing/subscription');
      this.go('pages/account/AccountBillingSubscriptionPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateAccountSettingsGeneral
   */
  navigateAccountSettingsGeneral: function () {
    if (app.user.isLoggedIn()) {
      this.navigate('account/settings/general');
      this.go('pages/account/AccountSettingsGeneralPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateAccountSettingsStudy
   */
  navigateAccountSettingsStudy: function () {
    if (app.user.isLoggedIn()) {
      this.navigate('account/settings/study');
      this.go('pages/account/AccountSettingsStudyPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateAccountSetup
   */
  navigateAccountSetup: function () {
    if (app.user.isLoggedIn()) {
      this.navigate('account/setup');
      this.go('pages/account/AccountSetupPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateAdmin
   */
  navigateAdmin: function () {
    if (app.user.isLoggedIn()) {
      this.navigate('admin');
      this.go('pages/admin/AdminPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * Route that applies a user referral to a user's account
   * @param {String} userId the id of the existing user that referred the new user
   */
  navigateApplyUserReferral: function (userId) {
    let signedIn = app.user.isLoggedIn();
    app.setUserReferral(userId, signedIn);

    if (signedIn) {
      this.navigateDashboard();
      app.processUserReferral();
    } else {
      this.navigateSignup();
    }
  },

  /**
   * @method navigateContact
   */
  navigateContact: function () {
    this.go('pages/contact/ContactPage');
  },

  /**
   * @method navigateDashboard
   */
  navigateDashboard: function () {
    if (app.user.isLoggedIn()) {
      this.navigate('dashboard');
      this.go('pages/dashboard/DashboardPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateDemo
   * @param {String} [lang]
   */
  navigateDemo: function (lang) {
    if (app.user.isLoggedIn()) {
      this.navigateDashboard();
    } else {
      this.go('pages/demo/DemoPage');
    }
  },

  /**
   * @method navigateDiscourseLogin
   */
  navigateDiscourseLogin: function () {
    // TODO: redirect to legacy until support is added
    location.href = location.href.toString().replace('https://www.', 'http://legacy.');
  },

  /**
   * @method navigateFeatures
   */
  navigateFeatures: function () {
    window.location.replace('/features');
  },

  /**
   * @method navigateHome
   */
  navigateHome: function () {
    if (app.isMobile()) {
      this.go('pages/home/HomePage');
    } else {
      window.location.replace('/');
    }
  },

  /**
   * @method navigateInstitutions
   */
  navigateInstitutions: function () {
    this.go('pages/institutions/InstitutionsPage');
  },

  /**
   * @method navigateLegal
   */
  navigateLegal: function () {
    this.go('pages/legal/LegalPage');
  },

  /**
   * Shows a page for the user to login
   * @method navigateLogin
   */
  navigateLogin: function () {
    if (app.user.isLoggedIn()) {
      this.defaultRoute();
    } else {
      this.navigate('login');
      this.go('pages/login/LoginPage');
    }
  },

  /**
   * Logs a user out if they're logged in, then shows the home page
   * @method navigateLogout
   */
  navigateLogout: function () {
    if (app.user.isLoggedIn()) {
      app.user.logout();
    } else {
      this.defaultRoute();
    }
  },

  /**
   * @method navigateNotFound
   */
  navigateNotFound: function () {
    this.go('pages/not-found/NotFoundPage');
  },

  /**
   * @method navigatePasswordReset
   */
  navigatePasswordReset: function () {
    if (app.user.isLoggedIn()) {
      this.defaultRoute();
    } else {
      this.navigate('password-reset');
      this.go('pages/password-reset/PasswordResetPage');
    }
  },

  /**
   * @method navigateScratchpad
   * @param {String} writing
   * @param {String} [part]
   */
  navigateScratchpad: function (writing, part) {
    this.go('pages/scratchpad/ScratchpadPage', {part: part, writing: writing});
  },

  /**
   * @method navigateSignup
   * @param {String} [plan]
   */
  navigateSignup: function (plan) {
    if (!app.user.isLoggedIn()) {
      this.navigate('signup', {replace: true});
      this.go('pages/signup/SignupPage', {plan: plan});
    } else {
      this.navigateDashboard();
    }
  },

  /**
   * @method navigateStats
   */
  navigateStats: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/stats/StatsPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateStudy
   * @param {String} [listId]
   * @param {String} [sectionId]
   */
  navigateStudy: function (listId, sectionId) {
    if (app.user.isLoggedIn()) {
      if (sectionId) {
        // TODO: replace when single list section study ready for action
        // this.go('pages/study-section', {listId: listId, sectionId: sectionId});
        this.go('pages/study/StudyPage');
      } else if (listId) {
        this.go('pages/study-list/StudyListPage.js', {listId: listId});
      } else {
        this.go('pages/study/StudyPage');
      }
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateSyncStatus
   */
  navigateSyncStatus: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/sync-status/SyncStatusPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateTest
   */
  navigateTest: function () {
    this.go('pages/test/TestPage');
  },

  /**
   * @method navigateTurkish
   */
  navigateTurkish: function () {
    this.go('pages/turkish/TurkishPage');
  },

  /**
   * Shows a page about the user referral system and shows a logged-in user
   * their unique link.
   * @method navigateUserReferralInfo
   */
  navigateUserReferralInfo: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/user-referral/UserReferralPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocab
   * @param {String} [vocabId]
   */
  navigateVocab: function (vocabId) {
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
   * @param {Boolean} [editMode]
   * @param {VocabListModel} [vocabList]
   * @param {Object} [vocabListSection]
   */
  navigateVocablist: function (listId, sectionId, editMode, vocabList, vocabListSection) {
    if (app.user.isLoggedIn()) {
      if (sectionId) {
        this.go('pages/vocablists/VocablistsListSectionPage', {vocablistId: listId, sectionId, editMode, vocabList, vocabListSection});
      } else {
        this.go('pages/vocablists/VocablistsListPage', {vocablistId: listId, editMode, vocabList});
      }
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocablistsBrowse
   */
  navigateVocablistsBrowse: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/vocablists/VocablistsBrowsePage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocablistsChinesepod
   */
  navigateVocablistsChinesepod: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/vocablists/VocablistsChinesepodPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocablistsDeleted
   */
  navigateVocablistsDeleted: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/vocablists/VocablistsDeletedPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocablistsCreate
   */
  navigateVocablistsCreate: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/vocablists/VocablistsCreatePage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocablistsMine
   */
  navigateVocablistsMine: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/vocablists/VocablistsMinePage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocablistsPublished
   */
  navigateVocablistsPublished: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/vocablists/VocablistsPublishedPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateVocablistsQueue
   */
  navigateVocablistsQueue: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/vocablists/VocablistsQueuePage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateWordsAll
   */
  navigateWordsAll: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/words/WordsAllPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateWordsBanned
   */
  navigateWordsBanned: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/words/WordsBannedPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateWordsMnemonics
   */
  navigateWordsMnemonics: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/words/WordsMnemonicsPage');
    } else {
      this.navigateLogin();
    }
  },

  /**
   * @method navigateWordsStarred
   */
  navigateWordsStarred: function () {
    if (app.user.isLoggedIn()) {
      this.go('pages/words/WordsStarredPage');
    } else {
      this.navigateLogin();
    }
  },

});
