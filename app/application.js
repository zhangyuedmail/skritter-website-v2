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
                    app.db.on('ready', callback);
                    app.db.open();
                } else {
                    app.db = null;
                    callback();
                }
            },
            //set time for last item changed
            function(callback) {
                if (app.user.isLoggedIn()) {
                    app.db.items
                        .orderBy('changed')
                        .last()
                        .then(function(item) {
                            app.set('lastItemChanged', item ? item.changed : 0);
                            callback();
                        });
                } else {
                    callback();
                }
            },
            //fetch and store changed items
            function(callback) {
                if (app.user.isLoggedIn()) {
                    var cursor = undefined;
                    var index = 0;
                    var limit = 2500;
                    var retries = 0;
                    async.whilst(
                        function() {
                            index++;
                            return cursor !== null;
                        },
                        function(callback) {
                            ScreenLoader.post('Fetching item batch #' + index);
                            $.ajax({
                                method: 'GET',
                                url: 'https://api-dot-write-way.appspot.com/v1/items',
                                data: {
                                    cursor: cursor,
                                    offset: app.get('lastItemChanged') + 1,
                                    order: 'changed',
                                    limit: limit,
                                    token: app.user.session.get('access_token')
                                },
                                error: function(error) {
                                    if (retries > 2) {
                                        callback(error);
                                    } else {
                                        retries++;
                                        limit = 500;
                                        setTimeout(callback, 1000);
                                    }
                                },
                                success: function(result) {
                                    app.db.transaction(
                                        'rw',
                                        app.db.items,
                                        function() {
                                            result.Items.forEach(function(item) {
                                                app.db.items.put(item);
                                            });
                                        }
                                    ).then(function() {
                                        cursor = result.cursor;
                                        setTimeout(callback, 100);
                                    }).catch(function(error) {
                                        if (retries > 2) {
                                            callback(error);
                                        } else {
                                            retries++;
                                            limit = 500;
                                            setTimeout(callback, 1000);
                                        }
                                    });
                                }
                            });
                        },
                        callback
                    );
                } else {
                    callback();
                }
            }
        ], _.bind(function() {
            ScreenLoader.post("Let's get started!");
            setTimeout(function() {
                ScreenLoader.hide();
                app.loadHelpscout();
                app.router.start();
            }, 500);
        }, this));

    }
});
