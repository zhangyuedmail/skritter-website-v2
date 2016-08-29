var GelatoApplication = require('gelato/application');
var AddVocabDialog = require('dialogs1/add-vocab/view');
var User = require('models/UserModel');
var Functions = require('functions');
var Mixpanel = require('mixpanel');
var Router = require('router');
var Config = require('config');

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
  initialize: function() {
    this.config = Config;

    /**
     * String to auto-populate signup form with
     * @type {String}
     */
    this.couponCode = null;
    this.checkAndSetReferralInfo();

    Raygun.init(
      'VF3L4HPYRvk1x0F5x3hGVg==',
      {
        excludedHostnames: ['localhost'],
        excludedUserAgents: ['PhantomJS'],
        ignore3rdPartyErrors: true,
        ignoreAjaxAbort: false,
        ignoreAjaxError: false
      }
    ).attach();

    Raygun.setVersion(this.get('version'));

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
    }

    if (this.isDevelopment()) {
      window.onerror = this.handleError;
    }
  },

  /**
   * @property defaults
   * @type {Object}
   */
  defaults: {
    apiDomain: location.hostname.indexOf('.cn') > -1 ? '.cn' : '.com',
    apiRoot: 'https://legacy.skritter',
    apiVersion: 0,
    demoLang: 'zh',
    description: '{!application-description!}',
    canvasSize: 450,
    language: undefined,
    lastItemChanged: 0,
    locale: 'en',
    nodeApiRoot: 'https://api-dot-write-way.appspot.com',
    timestamp: '{!timestamp!}',
    title: '{!application-title!}',
    version: '{!application-version!}'
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
    var siteRef = Functions.getParameterByName('siteref');
    var couponCode = Functions.getParameterByName('coupon');

    if (siteRef) {
      var expiration = moment().add(2, 'weeks').format(Config.dateFormatApp);
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
    // if (!this.isProduction() && this.localBackend) {
      return 'http://localhost:8080' + '/api/v' + this.get('apiVersion') + '/';
    // }

    return this.get('apiRoot') + this.get('apiDomain') + '/api/v' + this.get('apiVersion') + '/';
  },

  /**
   * Gets a stored coupon code passed in through a URL. Coupon codes part
   * of a referral take precedence.
   * @returns {String} the coupon code, if it exists
   */
  getStoredCouponCode: function() {
    var ref = (this.getSetting('siteRef') || {});
    var expiration = ref['expiration'];
    var couponCode = ref['couponCode'];

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
    return this.get('language') || this.user.get('targetLang');
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
    var ref = (this.getSetting('siteRef') || {});
    var referer = ref['referer'];
    var expiration = ref['expiration'];

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
    var referral = this.getSetting('referral');

    if (!referral) {
      return null;
    }

    var now = moment();
    var expiration = moment(referral.expiration, Config.dateFormatApp);

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
   * @method isChinese
   * @returns {Boolean}
   */
  isChinese: function() {
    return this.getLanguage() === 'zh';
  },

  /**
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
    var parent = document.getElementsByTagName('script')[0];
    var script = document.createElement('script');
    var HSCW = {config: {}};
    var HS = {beacon: {readyQueue: [], user: this.user}};
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
      color: '#32a8d9',
      icon: 'question',
      modal: true
    };
    HS.beacon.ready(function(beacon) {
      if (this.user.isLoggedIn()) {
        this.identify({
          email: this.user.get('email'),
          name: this.user.get('name')
        });
      }
    });
    script.async = false;
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
    var locale;
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
    var referral = this.getSetting('referral');

    if (!referral) {
      return false;
    }

    var now = moment();
    var expiration = moment(referral.expiration, Config.dateFormatApp);
    var dfd = $.Deferred();
    var self = this;

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
    var expiration = moment().add(2, 'weeks').format(Config.dateFormatApp);
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

    //load cached user data if it exists
    this.user.set(this.getLocalStorage(this.user.id + '-user'));
    this.user.session.set(this.getLocalStorage(this.user.id + '-session'));
    this.user.on('state', this.user.cache);
    this.user.session.on('state', this.user.session.cache);

    //set raygun tracking for logged in user
    if (this.user.isLoggedIn()) {
      Raygun.setUser(this.user.get('name'), false, this.user.get('email'));
      Raygun.withTags(this.user.getRaygunTags());
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
      this.listener.simple_combo("shift a", function() {
        new AddVocabDialog().open();
      });

    } else {
      Raygun.setUser('guest', true);
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
      }
    );

  }
});
