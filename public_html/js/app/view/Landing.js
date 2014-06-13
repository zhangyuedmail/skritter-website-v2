define([
    'require.text!template/landing.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class Landing
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
            this.$el.html(_.template(template, skritter.strings));
            this.loadElements();
            return this;
        },
        /**
         * @method loadElements
         */
        loadElements: function() {
            this.elements.targetLanguage = this.$('.target-language');
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-existing-user': 'handleExistingUserClick',
            'vclick .button-new-user': 'handleNewUserClick'
        },
        /**
         * @method handleExistingUserClick
         * @param {Object} event
         */
        handleExistingUserClick: function(event) {
            skritter.router.navigate('login', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleNewUserClick
         * @param {Object} event
         */
        handleNewUserClick: function(event) {
            skritter.router.navigate('signup', {replace: true, trigger: true});
            event.preventDefault();
        }
    });

    return View;
});