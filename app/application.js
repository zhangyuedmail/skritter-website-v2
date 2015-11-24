var GelatoApplication = require('gelato/application');
var User = require('models/user');
var Functions = require('functions');
var Router = require('router');

/**
 * @class Application
 * @extends {GelatoApplication}
 */
module.exports = GelatoApplication.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        Raygun.init('VF3L4HPYRvk1x0F5x3hGVg==', {
            excludedHostnames: ['localhost'],
            excludedUserAgents: ['PhantomJS'],
            ignore3rdPartyErrors: true,
            ignoreAjaxAbort: false,
            ignoreAjaxError: false
        }).attach();
        Raygun.setVersion(this.get('version'));
        this.fn = Functions;
        this.router = new Router();
        this.user = new User({id: this.getSetting('user') || 'application'});

        if (window.createjs) {
            createjs.Graphics.prototype.dashedLineTo = function(x1, y1, x2, y2, dashLength) {
                this.moveTo(x1 , y1);
                var dX = x2 - x1;
                var dY = y2 - y1;
                var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLength);
                var dashX = dX / dashes;
                var dashY = dY / dashes;
                var i = 0;
                while (i++ < dashes ) {
                    x1 += dashX;
                    y1 += dashY;
                    this[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1, y1);
                }
                this[i % 2 === 0 ? 'moveTo' : 'lineTo'](x2, y2);
                return this;
            };
        }

        if (window.ga && this.isProduction()) {
            ga('create', 'UA-4642573-1', 'auto');
            ga('set', 'forceSSL', true);
        }

        if (this.isDevelopment()) {
            window.onerror = this.handleError;
        }

        //TODO: depreciate this code after some time
        if (localStorage.getItem('guest-authentication')) {
            var user = localStorage.getItem('application-user');
            if (user) {
                localStorage.removeItem(user + '-authentication');
                localStorage.removeItem(user + '-settings');
                localStorage.removeItem(user + '-ja-data');
                localStorage.removeItem(user + '-zh-data');
            }
            localStorage.removeItem('guest-authentication');
            app.reload();
        }

    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        apiDomain: location.hostname.indexOf('.cn') > -1 ? '.cn' : '.com',
        apiRoot: 'https://beta.skritter',
        apiVersion: 0,
        description: '{!application-description!}',
        canvasSize: 450,
        language: undefined,
        lastReviewCheck: moment().unix(),
        timestamp: '{!timestamp!}',
        title: '{!application-title!}',
        version: '{!application-version!}'
    },
    /**
     * @method getApiUrl
     * @returns {String}
     */
    getApiUrl: function() {
        return this.get('apiRoot') + this.get('apiDomain') + '/api/v' + this.get('apiVersion') + '/';
    },
    /**
     * @method getLanguage
     * @returns {String}
     */
    getLanguage: function() {
        return this.get('language') || this.user.get('targetLang');
    },
    /**
     * @method getStripeKey
     * @returns {String}
     */
    getStripeKey: function() {
        return 'pk_live_xFAB9UJNUmEzr6yZfbVLZptc'; // TESTING
        if (this.isTesting()) {
            return 'pk_test_24FOCKPSEtJHVpcA3oErEw2I';
        } else {
            return 'pk_live_xFAB9UJNUmEzr6yZfbVLZptc';
        }
    },
    /**
     * @method getVersion
     * @returns {String}
     */
    getVersion: function() {
        var semantics = this.get('version').split('.');
        return [semantics[0], semantics[1], this.get('timestamp')].join('.');
    },
    /**
     * @method handleError
     * @param {String} message
     * @param {String} url
     * @param {Number} line
     * @returns {Boolean}
     */
    handleError: function(message, url, line) {
        $.notify(
            {
                title: 'Application Error',
                message: message
            },
            {
                type: 'pastel-danger',
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                delay: 5000,
                icon_type: 'class'
            }
        );
        return false;
    },
    /**
     * @method hideLoading
     * @param {Number} [speed]
     */
    hideLoading: function(speed) {
        $('#application-loading').fadeOut(speed);
    },
    /**
     * @method isAndroid
     * @returns {Boolean}
     */
    isAndroid: function() {
        // TODO: properly check if application is mobile
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
     * @method isIOS
     * @returns {Boolean}
     */
    isIOS: function() {
        // TODO: properly check if application is mobile
        return false;
    },
    /**
     * @method isMobile
     * @returns {Boolean}
     */
    isMobile: function() {
        // TODO: properly check if application is mobile
        return false;
    },
    /**
     * @method isTesting
     * @returns {String}
     */
    isTesting: function() {
        // TODO: Get this to return the right thing
        return _.contains(document.location.origin, 'localhost');
    },
    /**
     * @method isWebsite
     * @returns {String}
     */
    isWebsite: function() {
        // TODO: Get this to return the right thing
        return true;
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
            modal: false
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
     * @method sendRaygunTest
     */
    sendRaygunTest: function() {
        try {
            throw new Error('TEST ERROR');
        } catch(error) {
            Raygun.send(error);
        }
    },
    /**
     * @method showLoading
     * @param {Number} [speed]
     */
    showLoading: function(speed) {
        $('#application-loading').fadeIn(speed);
    },
    /**
     * @method start
     */
    start: function() {
        this.user.set(this.getLocalStorage(this.user.id + '-user'));
        this.user.session.set(this.getLocalStorage(this.user.id + '-session'));
        this.user.on('state', this.user.cache);
        this.user.session.on('state', this.user.session.cache);
        if (this.user.isLoggedIn()) {
            Raygun.setUser(this.user.get('name'), false, this.user.get('email'));
            Raygun.withTags(this.user.getRaygunTags());
        } else {
            Raygun.setUser('guest', true);
        }
        if (this.user.session.isExpired()) {
            if (this.user.id === 'application') {
                this.user.session.authenticate('client_credentials', null, null,
                    _.bind(function() {
                        this.startRouter();
                    }, this),
                    _.bind(function() {
                        this.startRouter();
                    }, this)
                );
            } else {
                this.user.session.refresh(
                    _.bind(function() {
                        this.startRouter();
                    }, this),
                    _.bind(function() {
                        this.startRouter();
                    }, this)
                );
            }
        } else {
            this.startRouter();
        }
    },
    /**
     * @method startRouter
     */
    startRouter: function() {
        this.router.start();
        this.loadHelpscout();
        this.hideLoading();
    }
});
