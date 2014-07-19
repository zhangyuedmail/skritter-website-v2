define([
    'require.text!template/landing.html',
    'view/View'
], function(template, View) {
    /**
     * @class Landing
     */
    var Landing = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Landing}
         */
        render: function() {
            this.setTitle('Welcome');
            this.$el.html(_.template(template, skritter.strings));
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
        events: function() {
            return _.extend({}, View.prototype.events, {
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

    return Landing;
});