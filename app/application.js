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
     * @method sendRaygunTestError
     */
    sendRaygunTestError: function() {
        try {
            throw new Error('TEST ERROR');
        } catch(error) {
            Raygun.send(error);
        }
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
        $('#application-loading').fadeOut(500, function() {
            $(this).remove();
        });
    }
});
