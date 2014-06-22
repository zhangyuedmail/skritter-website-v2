define([
    'model/user/Data',
    'model/user/Scheduler',
    'model/user/Settings',
    'model/user/Subscription',
    'model/user/Sync'
], function(Data, Scheduler, Settings, Subscription, Sync) {
    /**
     * @class User
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.data = new Data();
            this.scheduler = new Scheduler();
            this.settings = new Settings();
            this.subscription = new Subscription();
            this.sync = new Sync();
            //loads models for authenticated active user
            if (window.localStorage.getItem('active')) {
                var userId = window.localStorage.getItem('active');
                this.set(JSON.parse(window.localStorage.getItem(userId)), {silent: true});
                skritter.api.set('token', this.get('access_token'), {silent: true});
                if (window.localStorage.getItem(userId + '-scheduler')) {
                    this.scheduler.set(JSON.parse(window.localStorage.getItem(userId + '-scheduler')), {silent: true});
                }
                if (window.localStorage.getItem(userId + '-settings')) {
                    this.settings.set(JSON.parse(window.localStorage.getItem(userId + '-settings')), {silent: true});
                }
                if (window.localStorage.getItem(userId + '-subscription')) {
                    this.subscription.set(JSON.parse(window.localStorage.getItem(userId + '-subscription')), {silent: true});
                }
                if (window.localStorage.getItem(userId + '-sync')) {
                    this.sync.set(JSON.parse(window.localStorage.getItem(userId + '-sync')), {silent: true});
                }
            }
            //set the id identical to the user_id
            this.set('id', this.get('user_id'), {silent: true});
            //immediately cache user settings on change
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
         * @method create
         * @param {String} username
         * @param {String} email
         * @param {String} password
         * @param {Function} callback
         */
        create: function(username, email, password, callback) {
            async.waterfall([
                function(callback) {
                    skritter.api.authenticateGuest(function(guest, status) {
                        if (status === 200) {
                            callback(null, guest);
                        } else {
                            callback(guest);
                        }
                    });
                },
                function(guest, callback) {
                    skritter.api.set('token', guest.access_token);
                    if (localStorage.getItem('anonymousUser')) {
                        console.log('existing anon', localStorage.getItem('anonymousUser'));
                        callback(null, JSON.parse(localStorage.getItem('anonymousUser')));
                    } else {
                        skritter.api.createAnonymousUser(null, function(user, status) {
                            if (status === 200) {
                                localStorage.setItem('anonymousUser', JSON.stringify(user));
                                callback(null, user);
                            } else {
                                callback(user);
                            }
                        });
                    }
                },
                function(user, callback) {
                    skritter.user.login(user.id, null, function(result, status) {
                        if (status === 200) {
                            callback(null, user);
                        } else {
                            callback(result);
                        }
                    });
                },
                function(user, callback) {
                    user.email = email;
                    user.name = username;
                    user.password = password;
                    skritter.api.updateUser(user, function(updatedUser, status) {
                        console.log('updated user', updatedUser, status);
                        if (status === 200) {
                            callback(null, updatedUser);
                        } else {
                            callback(JSON.parse(updatedUser.responseText), status);
                        }
                    });
                },
                function(updatedUser, callback) {
                    skritter.user.login(updatedUser.id, password, function(result, status) {
                        if (status === 200) {
                            callback(null, result, status);
                        } else {
                            callback(result);
                        }
                    });
                }
            ], function(error, result, status) {
                if (error) {
                    localStorage.removeItem('active');
                    callback(error, status);
                } else {
                    localStorage.removeItem('anonymousUser');
                    callback(result, status);
                }
            });
        },
        /**
         * @method getActiveParts
         * @returns {Array}
         */
        getActiveParts: function() {
            return this.isChinese() ? _.intersection(this.settings.get('filterChineseParts'), this.getEnabledParts()) : _.intersection(this.settings.get('filterJapaneseParts'), this.getEnabledParts());
        },
        /**
         * @method getActiveStyles
         * @returns {Array}
         */
        getActiveStyles: function() {
            if (this.isJapanese()) {
                return ['both'];
            } else if (this.isChinese() && this.settings.get('reviewSimplified') && this.settings.get('reviewTraditional')) {
                return ['both', 'simp', 'trad'];
            } else if (this.isChinese() && this.settings.get('reviewSimplified') && !this.settings.get('reviewTraditional')) {
                return ['both', 'simp'];
            } else {
                return ['both', 'trad'];
            }
        },
        /**
         * @method getActiveStyleName
         * @returns {String}
         */
        getActiveStyleName: function() {
            if (this.isJapanese()) {
                return 'both';
            } else if (this.isChinese() && this.settings.get('reviewSimplified') && this.settings.get('reviewTraditional')) {
                return 'both';
            } else if (this.isChinese() && this.settings.get('reviewSimplified') && !this.settings.get('reviewTraditional')) {
                return 'simp';
            } else {
                return 'trad';
            }
        },
        /**
         * @method getAvatar
         * @param {String} classes
         * @returns {String}
         */
        getAvatar: function(classes) {
            var avatar = this.settings.get('avatar');
            if (avatar) {
                avatar = "data:image/png;base64," + this.settings.get('avatar');
            } else {
                avatar = "img/avatar/default.png";
            }
            if (classes) {
                return "<img src='" + avatar + "' + class='" + classes + "' />";
            }
            return "<img src='" + avatar + "' />";
        },
        /**
         * @method getCustomData
         * @returns {Object}
         */
        getCustomData: function() {
            var review = skritter.user.scheduler.review;
            review = skritter.user.scheduler.review ? {
                itemId: review.get('itemId'),
                position: review.get('position')
            } : null;
            return {
                activeReview: review,
                studyTime: skritter.timer.time / 1000,
                view: Backbone.history.fragment
            };
        },
        /**
         * @method getEnabledParts
         * @returns {Array}
         */
        getEnabledParts: function() {
            return this.isChinese() ? this.settings.get('chineseStudyParts') : this.settings.get('japaneseStudyParts');
        },
        /**
         * @method fontClass
         * @returns {String}
         */
        getFontClass: function() {
            return this.isChinese() ? 'chinese-text' : 'japanese-text';            
        },
        /**
         * @method getLanguageCode
         * @returns {String}
         */
        getLanguageCode: function() {
            var applicationLanguageCode = skritter.getLanguageCode();
            if (applicationLanguageCode) {
                return applicationLanguageCode;
            }
            return this.settings.get('targetLang');
        },
        /**
         * @method getName
         * @returns {String}
         */
        getName: function() {
            return this.settings.get('name') ? this.settings.get('name') : this.id;
        },
        /**
         * @method getTags
         * @returns {Array}
         */
        getTags: function() {
            if (this.isJapanese()) {
                return ['japanese'];
            } else if (this.isChinese() && this.get('reviewSimplified') && this.get('reviewTraditional')) {
                return ['chinese', 'simplified', 'traditional'];
            } else if (this.isChinese() && this.get('reviewSimplified') && !this.get('reviewTraditional')) {
                return ['chinese', 'simplified'];
            } else {
                return ['chinese', 'traditional'];
            }
        },
        /**
         * @method isAudioEnabled
         * @returns {Boolean}
         */
        isAudioEnabled: function() {
            return this.settings.get('volume') === 0 ? false : true;
        },
        /**
         * Returns true if the target language is set to Chinese.
         * 
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            return this.getLanguageCode() === 'zh' ? true : false;
        },
        /**
         * Returns true if the target language is set to Japanese.
         * 
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            return this.getLanguageCode() === 'ja' ? true : false;
        },
        /**
         * @method isLoggedIn
         * @returns {Boolean}
         */
        isLoggedIn: function() {
            return this.get('access_token') ? true : false;
        },
        /**
         * @method isUsingPinyin
         * @returns {Boolean}
         */
        isUsingPinyin: function() {
            return this.settings.get('readingStyle') === 'pinyin' ? true : false;
        },
        /**
         * @method isUsingSentences
         * @returns {Boolean}
         */
        isUsingSentences: function() {
            return false;
        },
        /**
         * @method isUsingZhuyin
         * @returns {Boolean}
         */
        isUsingZhuyin: function() {
            return this.settings.get('readingStyle') === 'zhuyin' ? true : false;
        },
        /**
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        login: function(username, password, callback) {
            skritter.api.authenticateUser(username, password, _.bind(function(result, status) {
                if (status === 200) {
                    this.set(result);
                    async.series([
                        function(callback) {
                            skritter.user.settings.fetch(callback);
                        },
                        function(callback) {
                            skritter.user.subscription.fetch(callback);
                        }
                    ], function() {
                        localStorage.setItem('active', result.user_id);
                        callback(result, status);
                    });
                } else {
                    callback(result, status);
                }
            }, this));
        },
        /**
         * @method logout
         */
        logout: function() {
            skritter.modal.show('logout')
                    .set('.modal-title', 'Are you sure?')
                    .set('.modal-title-icon', null, 'fa-sign-out');
            skritter.modal.element('.modal-footer').hide();
            skritter.modal.element('.modal-button-logout').on('vclick', function() {
                skritter.modal.element('.modal-options').hide(500);
                skritter.modal.element(':input').prop('disabled', true);
                skritter.modal.element('.message').addClass('text-info');
                skritter.modal.element('.message').html("<i class='fa fa-spin fa-cog'></i> Signing Out");
                async.series([
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
                });
            });
        },
        /**
         * @method setActiveParts
         * @param {Array} parts
         * @returns {Array}
         */
        setActiveParts: function(parts) {
            if (this.isChinese()) {
                this.settings.set('filterChineseParts', parts);
                return _.intersection(this.get('filterChineseParts'), this.getEnabledParts());
            }
            this.settings.set('filterJapaneseParts', parts);
            return _.intersection(this.get('filterJapaneseParts'), this.getEnabledParts());
        },
        /**
         * @method setActiveStyles
         * @param {Array} styles
         * @returns {Array}
         */
        setActiveStyles: function(styles) {
            if (this.isChinese()) {
                if (styles.indexOf('simp') === -1) {
                    this.settings.set('reviewSimplified', false);
                } else {
                    this.settings.set('reviewSimplified', true);
                }
                if (styles.indexOf('trad') === -1) {
                    this.settings.set('reviewTraditional', false);
                } else {
                    this.settings.set('reviewTraditional', true);
                }
            }
            return this.getActiveStyles();
        },
        /**
         * @method update
         * @param {Fucntion} callback
         */
        update: function(callback) {
            skritter.api.updateUser(this.settings, function(user) {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });

    return Model;
});