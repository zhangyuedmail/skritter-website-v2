/**
 * @module Skritter
 * @submodule Model
 * @param Data
 * @param Scheduler
 * @param Settings
 * @param Sync
 * @author Joshua McFarland
 */
define([
    'model/user/Data',
    'model/user/Scheduler',
    'model/user/Settings',
    'model/user/Sync'
], function(Data, Scheduler, Settings, Sync) {
    /**
     * @class User
     */
    var User = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.data = new Data();
            this.scheduler = new Scheduler();
            this.settings = new Settings();
            this.sync = new Sync();
            //loads models for authenticated active user
            if (localStorage.getItem('active')) {
                var userId = localStorage.getItem('active');
                this.set(JSON.parse(localStorage.getItem(userId)), {silent: true});
                if (localStorage.getItem(userId + '-data'))
                    this.data.set(JSON.parse(localStorage.getItem(userId + '-data')), {silent: true});
                if (localStorage.getItem(userId + '-scheduler'))
                    this.scheduler.set(JSON.parse(localStorage.getItem(userId + '-scheduler')), {silent: true});
                if (localStorage.getItem(userId + '-settings'))
                    this.settings.set(JSON.parse(localStorage.getItem(userId + '-settings')), {silent: true});
                if (localStorage.getItem(userId + '-sync'))
                    this.sync.set(JSON.parse(localStorage.getItem(userId + '-sync')), {silent: true});
                skritter.api.set('token', this.get('access_token'));
            }
            this.set('id', this.get('user_id'));
            this.on('change', _.bind(this.cache, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            access_token: null,
            expires_in: null,
            refresh_token: null,
            token_type: null,
            user_id: 'guest'
        },
        /**
         * @method cache
         */
        cache: function() {
            skritter.api.set('token', this.get('access_token'), {silent: true});
            this.set('id', this.get('user_id'), {merge: true, silent: true});
            localStorage.setItem(this.get('user_id'), JSON.stringify(this.toJSON()));
        },
        /**
         * Returns true if the user has been authenticated and is logged in.
         * 
         * @method isLoggedIn
         * @returns {Boolean}
         */
        isLoggedIn: function() {
            if (this.get('access_token'))
                return true;
            return false;
        },
        /**
         * Performs a login that updates all of the necessary models and then
         * callbacks back when the operation has finished.
         * 
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        login: function(username, password, callback) {
            skritter.api.authenticateUser(username, password, _.bind(function(result) {
                if (result.statusCode === 200) {
                    this.set(result);
                    this.sync.cache();
                    async.series([
                        _.bind(function(callback) {
                            if (skritter.settings.isIndexedDB()) {
                                window.indexedDB.deleteDatabase(this.id);
                                skritter.storage.open(this.id, callback);
                            } else {
                                callback();
                            }
                        }, this),
                        _.bind(function(callback) {
                            this.settings.fetch(callback);
                        }, this),
                        _.bind(function(callback) {
                            skritter.storage.open(this.id, callback);
                        }, this)
                    ], function() {
                        localStorage.setItem('active', result.user_id);
                        callback(result);
                    });
                } else {
                    callback(result);
                }
            }, this));
        },
        /**
         * @method logout
         */
        logout: function() {
            async.series([
                function(callback) {
                    skritter.modal.show('loading', callback).set('.modal-body', 'LOGGING OUT');
                },
                function(callback) {
                    skritter.storage.destroy(callback);
                },
                function(callback) {
                    window.setTimeout(callback, 2000);
                }
            ], function() {
                localStorage.removeItem('active');
                localStorage.removeItem(skritter.user.id + '-sync');
                document.location.href = '';
                document.location.reload(true);
            });
        }
    });

    return User;
});