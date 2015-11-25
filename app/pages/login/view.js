var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components/marketing-footer/view');

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
        this.footer = new MarketingFooter();
        this.navbar = new DefaultNavbar();
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
     * @returns {Login}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.footer.setElement('#footer-container').render();
        if (this.getHeight() < app.getHeight()) {
            this.$('#footer-container').css(
                'margin-top',
                app.getHeight() - this.getHeight() + 8
            );
        }
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'keyup #login-password': 'handleKeyUpLoginPassword',
        'vclick #button-login': 'handleClickLoginButton',
        'vclick #button-skeleton': 'handleClickSkeleton'
    },
    /**
     * @method handleClickLoginButton
     * @param {Event} event
     */
    handleClickLoginButton: function(event) {
        event.preventDefault();
        this.login();
    },
    /**
     * @method handleKeyUpLoginPassword
     * @param {Event} event
     */
    handleKeyUpLoginPassword: function(event) {
        event.preventDefault();
        if (event.which === 13 || event.keyCode === 13) {
            this.login();
        }
    },
    /**
     * @method handleClickSkeleton
     * @param {Event} event
     */
    handleClickSkeleton: function(event) {
        event.preventDefault();
        switch (app.getPlatform()) {
            case 'Android':
                this.$('#login-password').val('5f26f50983');
                break;
            case 'iOS':
                this.$('#login-password').val('40e9095b1d');
                break;
            case 'Website':
                this.$('#login-password').val('0e78bfa162');
                break;
        }
        this.login();
    },
    /**
     * @method login
     */
    login: function() {
        var password = this.$('#login-password').val();
        var username = this.$('#login-username').val();
        this.$('#login-message').empty();
        this.$('#login-form').prop('disabled', true);
        app.showLoading();
        app.user.login(username, password,
            _.bind(function() {
                app.router.navigate('dashboard', {trigger: false});
                app.reload();
            }, this),
            _.bind(function(error) {
                self.$('#login-message').text(error.responseJSON.message);
                self.$('#login-form').prop('disabled', false);
                app.hideLoading();
            }, this)
        );
    },
    /**
     * @method remove
     * @returns {Login}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
