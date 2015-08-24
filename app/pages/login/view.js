var GelatoPage = require('gelato/page');
var MarketingNavbar = require('navbars/marketing/view');

/**
 * @class Login
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new MarketingNavbar();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Login - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {MarketingHome}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.render();
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'keyup #login-password': 'handleKeyUpLoginPassword',
        'vclick #button-login': 'handleClickLoginButton'
    },
    /**
     * @method handleClickLoginButton
     * @param {Event} event
     */
    handleClickLoginButton: function(event) {
        event.preventDefault();
        this.handleLogin(event);
    },
    /**
     * @method handleKeyUpLoginPassword
     * @param {Event} event
     */
    handleKeyUpLoginPassword: function(event) {
        event.preventDefault();
        if (event.which === 13 || event.keyCode === 13) {
            this.handleLogin(event);
        }
    },
    /**
     * @method handleLogin
     * @param {Event} event
     */
    handleLogin: function(event) {
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
            self.$('#login-message').text(error.responseJSON.message);
        });
    },
    /**
     * @method remove
     * @returns {MarketingHome}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
