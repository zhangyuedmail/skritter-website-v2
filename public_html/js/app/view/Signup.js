define([
    'require.text!template/signup.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class Signup
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
            window.document.title = "Sign Up - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            return this;
        },
        /**
         * @method loadElements
         * @param {Backbone.View}
         */
        loadElements: function() {
            this.elements.buttonBack = this.$('#button-back');
            this.elements.buttonNext = this.$('#button-next');
            this.elements.signupEmail = this.$('#signup-email');
            this.elements.signupPassword = this.$('#signup-password');
            this.elements.signupUsername = this.$('#signup-username');
            this.elements.message = this.$('#message');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick #button-back': 'handleBackClick',
                'vclick #button-next': 'handleNextClick'
            });
        },
        /**
         * @method handleNextClick
         * @param {Object} event
         */
        handleNextClick: function(event) {
            this.disableForm();
            this.elements.message.empty();
            var email = this.elements.signupEmail.val();
            var password = this.elements.signupPassword.val();
            var username = this.elements.signupUsername.val();
            this.elements.message.html("<i class='fa fa-spin fa-cog'></i> Creating Account");
            if (email, password, username) {
                skritter.user.create(username, email, password, _.bind(function(result, status) {
                    if (status === 200) {
                        document.location.href = '';
                    } else {
                        this.elements.message.text(result.message);
                        this.enableForm();
                    }
                }, this));
            } else {
                this.elements.message.text('Please fill in all fields.');
                this.enableForm();
            }
            event.preventDefault();
        }
    });

    return View;

});