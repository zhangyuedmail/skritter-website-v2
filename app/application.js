const GelatoApplication = require('gelato/application');
const AddVocabDialog = require('dialogs1/add-vocab/view');
const VocabViewerDialog = require('dialogs1/vocab-viewer/view');

const DefaultNavbar = require('components/navbars/NavbarDefaultComponent');
const MobileNavbar = require('components/navbars/NavbarMobileComponent');
const MarketingFooter = require('components/footers/MarketingFooterComponent');
const MobileSideMenuComponent = require('components/menus/MobileSideMenuComponent');
const VocabInfoContent = require('dialogs1/vocab-viewer/content/view');

const User = require('models/UserModel');
const Functions = require('functions');
const Mixpanel = require('mixpanel');
const Router = require('router');
const Config = require('config');
const vent = require('vent');

/**
 * The base singleton class for Skritter that constructs and initializes all
 * necessary subviews to run the app.
 * @class Application
 * @extends {GelatoApplication}
 */
module.exports = GelatoApplication.extend({

  /**
   * Initializes a new application instance. Sets up error handling, analytics,
   * and various app-level properties such as referrals.
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    GelatoApplication.prototype.initialize.apply(this, arguments);

    this.config = Config;

    /**
     * String to auto-populate signup form with
     * @type {String}
     */
    this.couponCode = null;
    this.checkAndSetReferralInfo();

    this.fn = Functions;
    this.mixpanel = Mixpanel;
    this.router = new Router();
    this.user = new User({id: this.getSetting('user') || 'application'});

    this.localBackend = this.fn.getParameterByName('thinkLocally');
    if (this.localBackend) {
      console.warn('NOTICE:', 'Using localhost backend');
    }

    if (window.ga && this.isProduction()) {
      ga('create', 'UA-4642573-1', 'auto');
      ga('set', 'forceSSL', true);
    }

    if (this.isWebsite()) {
      this.mixpanel.init(this.getMixpanelKey());
    } else {
      window.mixpanel = {
        alias: function() {},
        identify: function() {},
        init: function() {},
        register: function() {},
        track: function() {}
      };
    }

    if (this.isDevelopment()) {
      window.onerror = this.handleError;
    }

    this.initNavbar();
    this.initFooter();
    this.initSideViews();

    if (this.isMobile()) {
      this.listenTo(vent, 'mobileNavMenu:toggle', this.toggleSideMenu);
      this.listenTo(vent, 'vocabInfo:toggle', this.toggleVocabInfo);
      this.listenTo(vent, 'page:switch', () => { this.toggleSideMenu(false); });
    }
  },

  events: {
    'click #main-app-container-overlay': 'handleOverlayClick'
  },

  /**
   * @property defaults
   * @type {Object}
   * @TODO: remove these in favor of config versions
   */
  defaults: {
    apiDomain: location.hostname.indexOf('.cn') > -1 ? '.cn' : '.com',
    apiRoot: 'https://legacy.skritter',
    apiVersion: 0,
    demoLang: 'zh',
    description: '{!application-description!}',
    canvasSize: 450,
    language: null,
    lastItemChanged: 0,
    locale: 'en',
    timestamp: '{!timestamp!}',
    title: '{!application-title!}',
    version: '{!application-version!}'
  },

  // temporary hacks until code is refactored more
  get: function (key) {
    return this.config[key];
  },
  set: function(key, value) { this.config[key] = value; },

  dialogs: {
    vocabViewer: new VocabViewerDialog()
  },

  /**
   * Checks if the URL contains a siteref param, and if it does, sets its value
   * as the siteRef instance varaible on the application object. Processes and
   * stores a coupon code from the URL. If it is a part of an affiliate referral,
   * it stores the coupon for later use as a part of the referral.
   * If it is just a coupon URL parameter by itself, the coupon only stays as an
   * instance variable for the lifetime of the session.
   * @method checkAndSetReferralInfo
   */
  checkAndSetReferralInfo: function() {
    let siteRef = Functions.getParameterByName('siteref') || this.getSetting('siteRef');
    let couponCode = Functions.getParameterByName('coupon') || this.getSetting('coupon');

    if (siteRef && typeof siteRef === 'string') {
      let expiration = moment().add(2, 'weeks').format(Config.dateFormatApp);
      this.setSetting('siteRef', {
        referer: siteRef,
        expiration: expiration,
        couponCode: couponCode
      });
    } else if (couponCode) {
      this.couponCode = couponCode;
    }
  },

  /**
   * Gets the base URL for the API depending on the context in which the application is running.
   * @method getApiUrl
   * @returns {String} the base URL for the API
   */
  getApiUrl: function() {
    if (!this.isProduction() && this.localBackend) {
      return 'http://localhost:8080' + '/api/v' + this.config.apiVersion + '/';
    }

    return this.config.apiRoot + this.config.apiDomain + '/api/v' + this.config.apiVersion + '/';
  },

  /**
   * Gets a stored coupon code passed in through a URL. Coupon codes part
   * of a referral take precedence.
   * @returns {String} the coupon code, if it exists
   */
  getStoredCouponCode: function() {
    let ref = (this.getSetting('siteRef') || {});
    let expiration = ref['expiration'];
    let couponCode = ref['couponCode'];

    // check for a coupon code as part of an affiliate referral
    if (couponCode && expiration) {
      expiration = moment(expiration, Config.dateFormatApp);

      // if the referral is still valid, use that coupon code
      if (expiration.diff(moment().startOf('day'), 'days') > 0) {
        return couponCode;
      }
    }

    // otherwise return any non-affiliate-related coupon code we might have
    return this.couponCode;
  },

  /**
   * @method getLanguage
   * @returns {String}
   */
  getLanguage: function() {
    return _.isEmpty(this.config.language) ? this.user.get('targetLang') : this.config.language;
  },

  /**
   * @method getLanguageName
   * @returns {String}
   */
  getLanguageName: function () {
    return this.getLanguage() === 'ja' ? 'Japanese' : 'Chinese';
  },

  /**
   * @method getMixpanelKey
   * @returns {String}
   */
  getMixpanelKey: function() {
    if (this.isProduction()) {
      return '8ee755b0ebe4f1141cda5dd09186cdca';
    } else {
      return '456c03002118e80555d7136131bf10a3';
    }
  },

  /**
   * Gets the id of the person/organization who originally referred the user
   * to Skritter.
   * http://english.stackexchange.com/a/42636
   * @returns {null}
   */
  getRefererId: function() {
    let ref = (this.getSetting('siteRef') || {});
    let referer = ref['referer'];
    let expiration = ref['expiration'];

    if (!referer || !expiration) {
      return null;
    }

    expiration = moment(expiration, Config.dateFormatApp);

    // if more time has passed than allowed for a referral
    if (expiration.diff(moment().startOf('day'), 'days') < 0) {
      return null;
    }

    return referer;
  },

  /**
   * @method getStripeKey
   * @returns {String}
   */
  getStripeKey: function() {
    if (this.isProduction()) {
      return 'pk_live_pWk0Lg3fgazBwkmSrzxOJ0fc';
    } else {
      return 'pk_test_5RIYZGe8XgeYfU9pgvkxK01r';
    }
  },

  /**
   * Gets a user referral id. If it finds one, confirms that it's still valid
   * before returning it. If it's invalid/expired, this function removes
   * the referral setting.
   * @returns {String} The referrer id if found and valid, or null
   */
  getUserReferral: function() {
    let referral = this.getSetting('referral');

    if (!referral) {
      return null;
    }

    let now = moment();
    let expiration = moment(referral.expiration, Config.dateFormatApp);

    if (expiration.diff(now, 'days') > 0) {
      return referral.referrer;
    }
    this.removeSetting('referral');

    return null;
  },

  /**
   * @method handleError
   * @param {String} message
   * @param {String} [url]
   * @param {Number} [line]
   * @returns {Boolean}
   */
  handleError: function(message, url, line) {
    app.notifyUser({
      title: app.locale('common.errorApplication'),
      message: message
    });

    return false;
  },

  /**
   * Handles click on an overlay of the main app container.
   * Hides the mobile menu when clicked.
   * @param {jQuery.Event} e the click event
   */
  handleOverlayClick: function(e) {
    this.toggleSideMenu(false);
  },

  /**
   * Initilizes the navbar for the application based on the screen size/platform
   * of the device.
   * @method initNavbar
   */
  initNavbar: function() {

    // TODO: replace this with isAndroid || isIOS
    if (this.isMobile()) {
      this._views['navbar'] = new MobileNavbar();
    } else {
      this._views['navbar'] = new DefaultNavbar();
    }
  },

  /**
   * Initializes the footer component for the application
   * @method initFooter
   */
  initFooter: function() {
    if (!this.isMobile()) {
      this._views['footer'] =  new MarketingFooter();
    }
  },

  /**
   * Initializes app-level views that are rendered off to the sides of
   * the main application frame.
   * @method initSideViews
   */
  initSideViews: function() {
    if (this.isMobile()) {
      this._views['leftSide'] = new MobileSideMenuComponent({
        user: this.user
      });

      this._views['rightSide'] = new VocabInfoContent();
    }
  },

  /**
   * Determines whether the user is currently studying Chinese.
   * @method isChinese
   * @returns {Boolean}
   */
  isChinese: function() {
    return this.getLanguage() === 'zh';
  },

  /**
   * Determines whether the user is currently studying Japanese.
   * @method isJapanese
   * @returns {Boolean}
   */
  isJapanese: function() {
    return this.getLanguage() === 'ja';
  },

  /**
   * @method loadHelpscout
   */
  loadHelpscout: function() {
    let parent = document.getElementsByTagName('script')[0];
    let script = document.createElement('script');
    let HSCW = {config: {}};
    let HS = {beacon: {readyQueue: [], user: this.user}};
    HSCW.config = {
      contact: {
        enabled: true,
        formId: '34a3fef0-62f6-11e5-8846-0e599dc12a51'
      },
      docs: {
        enabled: true,
        baseUrl: 'https://skritter.helpscoutdocs.com/'
      }
    };
    HS.beacon.ready = function(callback) {
      this.readyQueue.push(callback);
    };
    HS.beacon.userConfig = {
      attachment: true,
      autoInit: true,
      color: '#32a8d9',
      icon: 'question',
      instructions: "Bugs, comments or suggestions? We'd love to hear from you!",
      modal: true,
      poweredBy: false,
      zIndex: 9999
    };
    HS.beacon.ready(function(beacon) {
      if (this.user.isLoggedIn()) {
        this.identify({
          email: this.user.get('email'),
          name: this.user.get('name')
        });
      }
    });
    script.async = true;
    script.src = 'https://djtflbt20bdde.cloudfront.net/';
    script.type = 'text/javascript';
    parent.parentNode.insertBefore(script, parent);
    window.HSCW = HSCW;
    window.HS = HS;
  },

  /**
   * @method locale
   * @param {String} path
   * @param {String} [code]
   * @returns {*}
   */
  locale: function(path, code) {
    let locale;
    try {
      locale = require('locale/' + (code || app.get('locale')));
    } catch (error) {
      locale = {};
    }
    return _.get(locale, path) || _.get(require('locale/en'), path);
  },

  /**
   *
   * @param {Object} options
   */
  notifyUser: function(options) {
    $.notify(
      {
        title: options.title,
        message: options.message
      },
      {
        type: options.type || 'pastel-danger',
        animate: {
          enter: options.animateEnter || 'animated fadeInDown',
          exit: options.animateExit || 'animated fadeOutUp'
        },
        delay: options.delay || 5000,
        icon_type: options.iconType || 'class'
      }
    );
  },

  /**
   * Processes a stored user referral after an account is created.
   * @param {Boolean} [suppressMessages] whether to hide any UI notifications
   *                                      about the process triggered from
   *                                      this method.
   * @method processUserReferral
   */
  processUserReferral: function(suppressMessages) {
    let referral = this.getSetting('referral');

    if (!referral) {
      return false;
    }

    let now = moment();
    let expiration = moment(referral.expiration, Config.dateFormatApp);
    let dfd = $.Deferred();
    let self = this;

    if (expiration.diff(now, 'days') > 0) {
      $.ajax({
        type: 'post',
        url: this.getApiUrl() + 'referrals',
        headers: {
          'Authorization': 'bearer ' + this.user.session.get('access_token')
        },
        data: {
          referrer: referral.referrer
        }
      })
        .done(function (response) {
          self.removeSetting('referral');
          dfd.resolve(response);
          if (!suppressMessages) {
            self.notifyUser({
              title: 'Referral successful',
              message: app.locale('common.userReferralSuccessful'),
              type: 'alert-pastel-info'
            });
          }
        })
        .fail(function(error) {
          dfd.reject('common.errorUserReferralFailed');
          // TODO
        });
    } else {
      this.removeSetting('referral');
      this.notifyUser({
        message: this.locale('common.errorUserReferralExpired')
      });
      dfd.reject('common.errorUserReferralExpired');
    }

    return dfd;
  },

  /**
   * Stores a user referral and optionally fires off the API request to process it
   * @param {String} userId the user id of the referrer
   * @param {Boolean} [processImmediately] whether to immediately fire off an API request
   * @method setUserReferral
   */
  setUserReferral: function(userId, processImmediately) {
    let expiration = moment().add(2, 'weeks').format(Config.dateFormatApp);
    this.setSetting('referral', {
      referrer: userId,
      expiration: expiration
    });

    if (processImmediately) {
      this.processUserReferral();
    }
  },

  /**
   * @method start
   */
  start: function() {
    GelatoApplication.prototype.start.apply(this, arguments);

    //load cached user data if it exists
    this.user.set(this.getLocalStorage(this.user.id + '-user'));
    this.user.session.set(this.getLocalStorage(this.user.id + '-session'));
    this.user.on('state', this.user.cache);
    this.user.session.on('state', this.user.session.cache);

    //set raygun tracking for logged in user
    if (this.user.isLoggedIn()) {
      mixpanel.register({
        'Client': 'Website',
        'Client Version': '2.0',
        'Display Name': this.user.get('name'),
        'Language Code': app.getLanguage()
      });
      mixpanel.identify(this.user.id);

      //cleanup unused indexedDB instance
      if (window.indexedDB) {
        window.indexedDB.deleteDatabase(this.user.id + '-database');
      }

      //lets start listening to global keyboard events
      this.listener = new window.keypress.Listener();
      this.listener.simple_combo(
        'shift a',
        function(event) {
          if ($(event.target).is('textarea')) {
            return true;
          }

          if ($(event.target).is('input') ) {
            return true;
          }

          new AddVocabDialog().open();

          return false;
        }
      );

    } else {
      mixpanel.register({
        'Client': 'Website',
        'Client Version': '2.0',
        'Display Name': null,
        'Language Code': null
      });
    }

    //use async for cleaner loading code
    async.series(
      [
        function(callback) {
          //check for user authentication type
          if (app.user.id === 'application') {
            app.user.session.authenticate(
              'client_credentials',
              null,
              null,
              function() {
                callback();
              },
              function() {
                callback();
              }
            );
          } else {
            app.user.session.refresh(
              function() {
                callback();
              },
              function(error) {
                // TODO: get refresh tokens working properly
                // if the session token is invalid, log the user out
                if (error.responseJSON.statusCode === 400 &&
                  error.responseJSON.message.indexOf("No such refresh token") > -1) {
                  app.user.logout();
                } else {
                  callback();
                }
              }
            );
          }
        }
      ],
      function() {
        setTimeout(function() {
          ScreenLoader.hide();

          app.loadHelpscout();
          app.router.start();
        }, 500);

        if (app.isCordova()) {
          setTimeout(navigator.splashscreen.hide, 1000);

          if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#262b30");
          }
        }
      }
    );
  },

  /**
   * Shows the side container of the application
   * @param {Boolean} [show] whether to show the side element
   */
  toggleSideMenu: function(show) {
    $('gelato-application').toggleClass('no-overflow', show);
    this.$('#main-app-container').toggleClass('push-right', show);
    this.$('#left-side-app-container').toggleClass('push-right', show);
    this.$('#main-app-container-overlay').toggleClass('show', show);

    // run an "onShow/onHide" cleanup/setup function every time the state changes, if it exists
    if (this._views['leftSide'].toggleVisibility) {
      this._views['leftSide'].toggleVisibility(this.$('#main-app-container').hasClass('push-right'));
    }
  },

  /**
   * Shows a vocab info side view on mobile devices.
   * @param {String} vocabId the vocab id
   */
  toggleVocabInfo: function(vocabId) {
    if (!this.isMobile()) {
      return;
    }

    if (vocabId) {
      // TODO: update vocab info view
      this._views['rightSide'].loadVocab(vocabId); // or something like this
      this.$('#right-side-app-container').toggleClass('push-main', !!vocabId);
    } else {

      // delay hiding the right side until the sliding animation of the main container is complete
      // setTimeout(() => {
      this.$('#right-side-app-container').toggleClass('push-main', !!vocabId);
      // }, 250);
    }

    this.$('#main-app-container').toggleClass('push-left', !!vocabId);
  }
});
