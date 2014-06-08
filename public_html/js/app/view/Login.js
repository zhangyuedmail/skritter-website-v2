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
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
            this.elements.loginUsername = this.$('#login-username');
            this.elements.loginPassword = this.$('#login-password');
            this.elements.message = this.$('#message');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'keyup #login-password': 'handleEnterPressed',
                'vclick .button-continue': 'handleLoginClicked'
            });
        },
        /**
         * @method disableForm
         */
        disableForm: function() {
            this.$(':input').prop('disabled', true);
        },
        /**
         * @method enableForm
         */
        enableForm: function() {
            this.$(':input').prop('disabled', false);
        },
        /**
         * @method clickLogin
         * @param {Object} event
         */
        handleLoginClicked: function(event) {
            this.disableForm();
            this.elements.message.empty();
            var username = this.elements.loginUsername.val();
            var password = this.elements.loginPassword.val();
            this.elements.message.html("<i class='fa fa-spin fa-cog'></i> Signing In");
            skritter.user.login(username, password, _.bind(function(result, status) {
                console.log('status', status);
                if (status === 200) {
                    document.location.href = '';
                } else {
                    this.elements.message.text(result.message);
                    this.enableForm();
                }
            }, this));
            event.preventDefault();
        },
        /**
         * @method handleEnterPressed
         * @param {Object} event
         */
        handleEnterPressed: function(event) {
            if (event.keyCode === 13) {
                this.handleLoginClicked(event);
            } else {
                event.preventDefault();
            }
        }
    });
    
    return View;
});