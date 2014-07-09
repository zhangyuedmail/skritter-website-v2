define([
    'require.text!template/home.html',
    'base/View',
    'view/component/ListTable'
], function(template, BaseView, ListTable) {
    /**
     * @class Home
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.listTable = new ListTable();
            this.listenTo(skritter.user.data.vocablists, 'add loaded', _.bind(this.updateVocabLists, this));
            this.listenTo(skritter.user.scheduler, 'sorted', _.bind(this.updateDueCounter, this));
            this.listenTo(skritter.user.data, 'change:syncing', _.bind(this.toggleSyncButton, this));
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.setTitle('Home');
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.listTable.setElement(this.elements.listTable).render();
            if (!skritter.user.subscription.isActive()) {
                var expireMessage = "<strong>Your subscription has expired.</strong> That means you'll be unable to add new items to study. ";
                expireMessage += "Go to <a href='#' class='button-account'>account settings</a> to add a subscription.";
                this.elements.message.html(skritter.fn.bootstrap.alert(expireMessage, 'danger'));
            }
            if (skritter.user.data.get('syncing')) {
                this.toggleSyncButton(null, true);
            }
            this.elements.userUsername.text(skritter.user.settings.get('name'));
            this.updateDueCounter();
            this.updateVocabLists();
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.buttonSync = this.$('.button-sync');
            this.elements.dueCount = this.$('.due-count');
            this.elements.listTable = this.$('#vocab-lists-container');
            this.elements.message = this.$('#message');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-account': 'handleAccountClick',
                'vclick .button-lists': 'handleListsClick',
                'vclick .button-study': 'handleStudyClick',
                'vclick .button-sync': 'handleSyncClick'
            });
        },
        /**
         * @method handleAccountClick
         * @param {Object} event
         */
        handleAccountClick: function(event) {
            skritter.router.navigate('user/account', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleListsClick
         * @param {Object} event
         */
        handleListsClick: function(event) {
            skritter.router.navigate('vocab/list', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleStudyClick
         * @param {Object} event
         */
        handleStudyClick: function(event) {
            skritter.router.navigate('study', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleSyncClick
         * @param {Object} event
         */
        handleSyncClick: function(event) {
            skritter.user.data.sync();
            event.preventDefault();
        },
        /**
         * @method toggleSyncButton
         * @param {Backbone.Model} model
         * @param {Boolean} value
         */
        toggleSyncButton: function(model, value) {
            if (value) {
                this.elements.buttonSync.children('i').addClass('fa-spin');
            } else {
                this.elements.buttonSync.children('i').removeClass('fa-spin');
                skritter.user.scheduler.sort();
            }
        },
        /**
         * @method updateDueCounter
         */
        updateDueCounter: function() {
            this.elements.dueCount.text(skritter.user.scheduler.getDueCount());
        },
        /**
         * @method updateVocabLists
         */
        updateVocabLists: function() {
            this.listTable.set(skritter.user.data.vocablists.toJSON(), {
                name: 'Title',
                studyingMode: 'Status'
            }).filterByStatus(['adding', 'reviewing']);
        }
    });

    return View;

});