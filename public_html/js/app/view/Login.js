define([
    'require.text!template/login.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class Login
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
            this.setTitle('Log In');
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            return this;
        },
        /**
         * @method loadElements
         * @param {Backbone.View}
         */
        loadElements: function() {
            this.elements.loginUsername = this.$('#login-username');
            this.elements.loginPassword = this.$('#login-password');
            this.elements.message = this.$('#message');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick #button-back': 'handleBackClick',
                'vclick #button-next': 'handleLoginClick',
                'keyup #login-password': 'handleEnterPress'
            });
        },
        /**
         * @method handleLoginClick
         * @param {Object} event
         */
        handleLoginClick: function(event) {
            this.disableForm();
            this.elements.message.empty();
            var username = this.elements.loginUsername.val();
            var password = this.elements.loginPassword.val();
            skritter.modal.show('loading').set('.message', 'Signing In');
            skritter.user.login(username, password, _.bind(function(result, status) {
                if (status === 200) {
                    document.location.href = '';
                } else {
                    skritter.modal.hide();
                    this.elements.message.text(result.message);
                    this.enableForm();
                }
            }, this));
            event.preventDefault();
        },
        /**
         * @method handleEnterPress
         * @param {Object} event
         */
        handleEnterPress: function(event) {
            if (event.keyCode === 13) {
                this.handleLoginClick(event);
            } else {
                event.preventDefault();
            }
        }
    });

    return View;
});