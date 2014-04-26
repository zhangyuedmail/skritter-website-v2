/**
 * @module Skritter
 * @submodule View
 * @param templateLogin
 * @author Joshua McFarland
 */
define([
    'require.text!template/login.html'
], function(templateLogin) {
    /**
     * @class Login
     */
    var Login = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            document.title = "Skritter - Login";
            this.$el.html(templateLogin);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click #button-home': 'toHome',
            'click #button-login': 'login'
        },
        /**
         * @method disableForm
         */
        disableForm: function() {
            this.$(':input').prop('disabled', true);
        },
        /**
         * @method enableFprm
         */
        enableForm: function() {
            this.$(':input').prop('disabled', false);
        },
        /**
         * @method toLogin
         * @param {Object} event
         */
        login: function(event) {
            this.disableForm();
            var username = this.$('#username').val();
            var password = this.$('#password').val();
            skritter.user.login(username, password, _.bind(function(result) {
                if (result.statusCode === 200) {
                    skritter.user.sync.changedItems(function() {
                        document.location.href = '';
                    });
                } else {
                    this.$('#message').html(result.message ? result.message : skritter.nls.login['message-error']);
                    this.enableForm();
                }
            }, this));
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
         * @method toHome
         * @param {Object} event
         */
        toHome: function(event) {
            skritter.router.navigate('', {trigger: true, replace: true});
            event.preventDefault();
        }
    });
    
    return Login;
});