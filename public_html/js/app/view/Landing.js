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
            BaseView.prototype.render.call(this);
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.targetLanguage = this.$('.target-language');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-existing-user': 'handleExistingUserClick',
                'vclick .button-new-user': 'handleNewUserClick'
            });
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