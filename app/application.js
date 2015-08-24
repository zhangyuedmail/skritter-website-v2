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
        return this.get('language');
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
        return this.get('language') === 'zh';
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.get('language') === 'ja';
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
        this.router.start();
    }
});
