define([
    'require.text!template/home.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class Home
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Home - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            this.loadElements();
            this.elements.dueCount.text(skritter.user.scheduler.getDueCount(true));
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.elements.userUsername.text(skritter.user.settings.get('name'));
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            this.elements.buttonSync = this.$('.button-sync');
            this.elements.dueCount = this.$('.due-count');
            this.elements.listCount = this.$('.list-count');
            this.elements.userAvatar = this.$('.user-avatar');
            this.elements.userUsername = this.$('.user-username');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-lists': 'handleListsClick',
            'vclick .button-study': 'handleStudyClick'
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
        }
    });

    return View;

});