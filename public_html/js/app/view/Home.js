/**
 * @module Skritter
 * @submodule View
 * @param templateHomeLoggedIn
 * @param templateHomeLoggedOut
 * @author Joshua McFarland
 */
define([
    'require.text!template/home-logged-in.html',
    'require.text!template/home-logged-out.html'
], function(templateHomeLoggedIn, templateHomeLoggedOut) {
    /**
     * @class Home
     */
    var Home = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.languageCode = skritter.settings.getLanguageCode();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            if (skritter.user.isLoggedIn()) {
                document.title = "Skritter - " + skritter.user.settings.get('name');
                this.$el.html(templateHomeLoggedIn);
                this.preloadFont();
                this.$('#user-avatar').html(skritter.user.settings.getAvatar('img-thumbnail'));
                this.$('#user-due-count').text(skritter.user.scheduler.getDueCount(true));
                this.$('#user-id').text(skritter.user.settings.get('name'));
                if (skritter.user.sync.isActive()) {
                    this.toggleSyncButton();
                }
            } else {
                document.title = "Skritter - Learn to Write Chinese and Japanese Characters";
                this.$el.html(templateHomeLoggedOut);
                if (this.languageCode) {
                    this.$('#language-text').text(this.languageCode === 'zh' ? '中文' : '日本語');
                }
            }
            this.listenTo(skritter.user.scheduler, 'schedule:sorted', _.bind(this.updateDueCount, this));
            this.listenTo(skritter.user.sync, 'change:syncing', this.toggleSyncButton);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-edit-account': 'navigateAccount',
            'vclick .button-existing-user': 'navigateLogin',
            'vclick .button-lists': 'navigateLists',
            'vclick .button-logout': 'logout',
            'vclick .button-new-user': 'navigateNewUser',
            'vclick .button-review-list': 'navigateReviewList',
            'vclick .button-study': 'navigateStudy',
            'vclick .button-sync': 'sync'
        },
        /**
         * @method logout
         * @param {Object} event
         */
        logout: function(event) {
            skritter.modal.show('logout');
            skritter.modal.element('.modal-footer').hide();
            skritter.modal.element('.modal-button-logout').on('vclick', function() {
                skritter.modal.element('.modal-footer').show();
                skritter.modal.element(':input').prop('disabled', true);
                skritter.modal.element('.message').addClass('text-info');
                skritter.modal.element('.message').html("<i class='fa fa-spin fa-spinner'></i> Logging Out");
                skritter.user.logout();
            });
            event.preventDefault();
        },
        /**
         * @method preloadFont
         */
        preloadFont: function() {
            if (this.languageCode === 'zh') {
                this.$('#font-preloader').addClass('chinese-text');
            } else {
                this.$('#font-preloader').addClass('japanese-text');
            }
        },
        /**
         * @method toggleSyncButton
         */
        toggleSyncButton: function() {
            if (skritter.user.sync.isActive()) {
                this.$('.button-sync i').addClass('fa-spin');
            } else {
                this.$('.button-sync i').removeClass('fa-spin');
            }
        },
        /**
         * @method navigateAccount
         * @param {Object} event
         */
        navigateAccount: function(event) {
            skritter.router.navigate('account', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateLists
         * @param {Object} event
         */
        navigateLists: function(event) {
            skritter.router.navigate('vocab/list', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateLogin
         * @param {Object} event
         */
        navigateLogin: function(event) {
            skritter.router.navigate('login', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateNewUser
         * @param {Object} event
         */
        navigateNewUser: function(event) {
            skritter.router.navigate('user/new', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateReviewList
         * @param {Object} event
         */
        navigateReviewList: function(event) {
            skritter.router.navigate('review', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateStudy
         * @param {Object} event
         */
        navigateStudy: function(event) {
            skritter.router.navigate('study', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method sync
         */
        sync: function() {
            if (!skritter.user.sync.isActive()) {
                skritter.modal.show('download')
                        .set('.modal-title', 'SYNCING')
                        .progress(100);
                async.series([
                    function(callback) {
                        skritter.user.sync.reviews(callback);
                    },
                    function(callback) {
                        skritter.user.sync.changedItems(callback);
                    }
                ], function() {
                    skritter.modal.hide();
                });
            }
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.$('#user-due-count').text(skritter.user.scheduler.getDueCount());
        }
    });
    
    return Home;
});