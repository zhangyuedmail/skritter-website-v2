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
     * @constructorApply
     */
    initialize: function() {
        window.onerror = this.handleError;
        Raygun.init('VF3L4HPYRvk1x0F5x3hGVg==', {
            excludedHostnames: ['localhost'],
            excludedUserAgents: ['PhantomJS'],
            ignore3rdPartyErrors: true
        }).attach();
        Raygun.setVersion(this.get('version'));
        this.fn = Functions;
        this.router = new Router();
        this.user = new User({id: this.getSetting('user')});

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
        canvasSize: 450,
        date: '{!date!}',
        language: '{!application-language!}',
        lastReviewCheck: moment().unix(),
        name: '{!application-name!}',
        timestamp: '{!timestamp!}',
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
        return this.get('language') === 'undefined' ? this.user.get('targetLang') : this.get('language');
    },
    /**
     * @method getStripeKey
     * @returns {String}
     */
    getStripeKey: function() {
        return 'pk_live_xFAB9UJNUmEzr6yZfbVLZptc'; // TESTING
        if (this.isTesting()) {
            return 'pk_test_24FOCKPSEtJHVpcA3oErEw2I';
        }
        else {
            return 'pk_live_xFAB9UJNUmEzr6yZfbVLZptc';
        }
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
                icon: 'fa fa-exclamation-circle',
                title: 'Error',
                message: message
            },
            {
                type: 'minimalist',
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
     * @method isMobile
     * @returns {Boolean}
     */
    isMobile: function() {
        // TODO: properly check if application is mobile
        return true;
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
        var HSCW = {config: {}};
        var HS = {beacon: {}};

        HSCW.config = {
            contact: {
                enabled: true,
                formId: '34a3fef0-62f6-11e5-8846-0e599dc12a51'
            },
            docs: {
                enabled: true,
                baseUrl: 'http://skritter.helpscoutdocs.com/'
            }
        };

        HS.beacon.userConfig = {
            color: '#32a8d9',
            icon: 'question',
            modal: false
        };

        var parent = document.getElementsByTagName('script')[0];
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://djtflbt20bdde.cloudfront.net/';
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
        this.user.on('state:standby', this.user.cache);
        if (this.user.isLoggedIn()) {
            Raygun.setUser(this.user.get('name'), false, this.user.get('email'));
            Raygun.withTags(this.user.getRaygunTags());
        } else {
            Raygun.setUser('guest', true);
        }
        this.router.start();
        this.loadHelpscout();
        this.hideLoading();
    }
});
