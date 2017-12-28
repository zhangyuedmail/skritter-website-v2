const GelatoPage = require('gelato/page');
const SignupNotification = require('components/account/SignupNotificationComponent');
const DashboardGoal = require('components/dashboard/DashboardGoalComponent');
const DashboardMonth = require('components/dashboard/DashboardMonthComponent');
const DashboardProgress = require('components/dashboard/DashboardProgressComponent');
const DashboardQueue = require('components/dashboard/DashboardQueueComponent');
const DashboardStatus = require('components/dashboard/DashboardStatusComponent');
const DashboardTotal = require('components/dashboard/DashboardTotalComponent');
const ExpiredNotification = require('components/account/AccountExpiredNotificationComponent');
const MobileNavbar = require('components/navbars/NavbarMobileDashboardComponent');
const ViewDialog = require('dialogs1/view-dialog/view');
const ReleaseNotes = require('components/common/ReleaseNotesComponent');

/**
 * A page that shows a summary of the user's review count due, stats, and lists
 * they're studying.
 * @class Dashboard
 * @extends {GelatoPage}
 */
const DashboardPage = GelatoPage.extend({

  events: {
    'click #feedback-btn': 'onFeedbackBtnClicked',
    'click #goal-setting': 'onGoalSettingClicked',
    'click #rating-btn': 'onRatingBtnClicked',
    'click #rating-cancel-btn': 'onRatingCancelBtnClicked',
    'click #signup-btn': 'onSignupBtnClicked',
  },

  /**
   * @property mobileNavbar
   * @type {MobileNavbar}
   */
  mobileNavbar: MobileNavbar,

  navbarOptions: {
    showSyncBtn: true,
  },

  /**
   * @property showFooter
   * @type {Boolean}
   */
  showFooter: !app.isMobile(),

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.dashboard.title'),

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Dashboard'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
    }

    if (app.config.goalModeEnabled && app.user.get('goalEnabled')) {
      this._views['goal'] = new DashboardGoal();
    } else {
      this._views['goal'] = new DashboardStatus();
    }


    this._views['queue'] = new DashboardQueue();
    this._views['expiration'] = new ExpiredNotification();

    if (app.isMobile()) {
      this._views['progress'] = new DashboardProgress();
      this._views['signup'] = new SignupNotification();
    } else {
      this._views['month'] = new DashboardMonth();
      this._views['total'] = new DashboardTotal();
    }

    if (app.config.recordLoadTimes) {
      this.componentsLoaded = {
        goal: false,
        month: false,
        queue: false,
      };
      this.loadAlreadyTimed = false;

      this.listenTo(this._views['goal'], 'component:loaded', this.onComponentLoaded);
      this.listenTo(this._views['month'], 'component:loaded', this.onComponentLoaded);
      this.listenTo(this._views['queue'], 'component:loaded', this.onComponentLoaded);
    }

    // this.listenTo(this._views['expiration'], 'fetch-data:failed', this.subscriptionFetchFailed);
    this.listenTo(app.user.subscription, 'state:standby', this.onSubscriptionSync);

    app.mixpanel.track('Viewed dashboard page');

    app.capturePlatformInfo();
  },

  /**
   * @method render
   * @returns {Dashboard}
   */
  render: function () {
    this.renderTemplate();

    if (this._views['signup']) {
      this._views['signup'].setElement('#signup-container').render();
    }

    if (this._views['month']) {
      this._views['month'].setElement('#dashboard-month-container').render();
    }

    if (this._views['progress']) {
      this._views['progress'].setElement('#dashboard-progress-container').render();
    }

    if (this._views['total']) {
      this._views['total'].setElement('#dashboard-total-container').render();
    }

    this._views['goal'].setElement('#dashboard-goal-container').render();
    this._views['queue'].setElement('#dashboard-queue-container').render();
    this._views['expiration'].setElement('#subscription-notice').render();

    this._checkForReleaseNotes();

    return this;
  },

  /**
   *
   * @param {String} component the name/key of the component loaded
   */
  onComponentLoaded: function (component) {
    this.componentsLoaded[component] = true;

    if (this.loadAlreadyTimed) {
      return;
    }

    if (app.config.recordLoadTimes) {
      for (let key in this.componentsLoaded) {
        if (this.componentsLoaded[key] !== true) {
          return;
        }
      }

      this.loadAlreadyTimed = true;
      const loadTime = window.performance.now() - this.loadStart;
      app.loadTimes.pages.dashboard.push(loadTime);
    }
  },

  /**
   * Opens a dialog the user can leave app feedback in.
   */
  onFeedbackBtnClicked: function () {
    app.showFeedbackDialog();
  },

  /**
   * Opens the main app signup dialog.
   */
  onSignupBtnClicked: function () {
    app.signup();
  },

  /**
   * Opens the goal setting dialog for goal component options.
   */
  onGoalSettingClicked: function (event) {
    event.preventDefault();

    app.router.navigateAccountSettingsStudy('goal-mode-section');
  },

  onRatingBtnClicked: function () {
    if (app.isAndroid()) {
      if (app.getLanguage() === 'zh') {
        plugins.core.openGooglePlay('com.inkren.skritter.chinese');
      } else {
        plugins.core.openGooglePlay('com.inkren.skritter.japanese');
      }
    }

    if (app.isIOS()) {
      if (app.getLanguage() === 'zh') {
        window.open('itms-apps://itunes.apple.com/app/skritter-chinese/id520277126', '_system');
      } else {
        window.open('itms-apps://itunes.apple.com/app/skritter-japanese/id548801568', '_system');
      }
    }

    this.$('.rating-notice').hide();

    app.user.set('hideRatingNotice', true);
    app.user.cache();
  },

  onRatingCancelBtnClicked: function () {
    this.$('.rating-notice').hide();

    app.user.set('hideRatingNotice', true);
    app.user.cache();
  },

  onSubscriptionSync: function (sub) {
    const $ratingNotice = this.$('.rating-notice');

    if (app.user.get('hideRatingNotice')) {
      $ratingNotice.addClass('hidden');

      return;
    }

    if (!sub.isSubscribed()) {
      $ratingNotice.addClass('hidden');

      return;
    }

    $ratingNotice.removeClass('hidden');
  },

  /**
   * Checks whether the user has seen the release notes for the current version
   * of the app if it's recently been released.
   * If not, updates a flag to show that the user has seen them,
   * then opens the release notes.
   * @private
   */
  _checkForReleaseNotes () {
    if (!app.isIOS() && !app.getSetting('releaseNotesViewed-' + app.config.version)) {
      if (moment().diff(moment(Number(app.config.timestamp) * 1000), 'days') < 4) {
        this._showReleaseNotes();
        app.setSetting('releaseNotesViewed-' + app.config.version, true);
      }
    }
  },

  /**
   * Creates an instance of a dialog to show release notes and opens it up
   * @private
   */
  _showReleaseNotes () {
    this._views['releaseNotes'] = new ViewDialog({
      showCloseButton: true,
      showTitle: true,
      dialogTitle: app.locale('components.releaseNotes.title') + ' - v' + app.config.version,
      content: ReleaseNotes,
    });
    this._views['releaseNotes'].open();
  },
});

module.exports = DashboardPage;
