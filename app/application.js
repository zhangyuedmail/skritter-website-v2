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

        if (window.ga && this.isProduction()) {
            ga('create', 'UA-4642573-1', 'auto');
            ga('set', 'forceSSL', true);
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
        apiRoot: 'https://beta.skritter',
        apiVersion: 0,
        description: '{!application-description!}',
        canvasSize: 450,
        language: undefined,
        lastItemChanged: 0,
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
        if (this.isProduction()) {
            return 'pk_live_xFAB9UJNUmEzr6yZfbVLZptc';
        } else {
            return 'pk_test_24FOCKPSEtJHVpcA3oErEw2I';
        }
    },
    /**
     * @method handleError
     * @param {String} message
     * @param {String} [url]
     * @param {Number} [line]
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
     * @method reset
     */
    reset: function() {
        app.user.setLastItemUpdate(0).cache();
        app.db.items.clear().finally(app.reload);
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
        } else {
            Raygun.setUser('guest', true);
        }

        //console log all dexie errors
        Dexie.Promise.on('error', function(error) {
            console.error(error);
            if (app.isDevelopment()) {
                app.handleError(error);
            }
        });

        //use async for cleaner loading code
        async.series([
            function(callback) {
                //check for user authentication type
                if (app.user.id === 'application') {
                    app.user.session.authenticate('client_credentials', null, null,
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
                        function() {
                            callback();
                        }
                    );
                }
            },
            //load dexie with items store
            function(callback) {
                if (app.user.isLoggedIn()) {
                    app.db = new Dexie(app.user.id + '-database');
                    app.db.version(1).stores({
                        items: [
                            'id',
                            '*changed',
                            'created',
                            'interval',
                            '*last',
                            '*next',
                            'part',
                            'previousInterval',
                            'previousSuccess',
                            'reviews',
                            'successes',
                            'style',
                            'timeStudied',
                            'vocabIds'
                        ].join(',')
                    });
                    app.db.open()
                        .then(function() {
                            callback();
                        })
                        .catch(function() {
                            app.db.delete().then(app.reload);
                        });
                } else {
                    app.db = null;
                    callback();
                }
            },
            //fetch and store changed items
            function(callback) {
                app.user.updateItems(callback);
            }
        ], function() {
            setTimeout(function() {
                ScreenLoader.hide();
                app.loadHelpscout();
                app.router.start();
            }, 500);
        });

    }
});
