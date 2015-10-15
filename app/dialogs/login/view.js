var GelatoDialog = require('gelato/bootstrap/dialog');

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
     * @method render
     * @returns {LoginDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
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
        this.$('#login-form').prop('disabled', true);
        app.user.login(username, password, function() {
            app.router.navigate('dashboard', {trigger: false});
            app.reload();
        }, function(error) {
            self.$('#login-message').text(error.message);
            self.$('#login-form').prop('disabled', false);
        });
    }
});
