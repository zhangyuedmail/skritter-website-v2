var GelatoDialog = require('gelato/modules/dialog');

/**
 * @class LoginDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('dialogs/login/template'),
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-login': 'handleClickLogin'
    },
    /**
     * @method handleClickLogin
     * @param {Event} event
     */
    handleClickLogin: function(event) {
        event.preventDefault();
        var self = this;
        var password = this.$('#login-password').val();
        var username = this.$('#login-username').val();
        this.$('#login-message').empty();
        this.disableForm('#login-form');
        app.user.login(username, password, function() {
            app.router.navigate('dashboard', {trigger: false});
            app.reload();
        }, function(error) {
            self.enableForm('#login-form');
            self.$('#login-message').text(error.message);
        });
    }
});
