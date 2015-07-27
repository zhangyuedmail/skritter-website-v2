var GelatoPage = require('gelato/page');

/**
 * @class Login
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property title
     * @type {String}
     */
    title: 'Login - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/login/template'),
    /**
     * @method render
     * @returns {MarketingHome}
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
        this.disableForm('#login-form');
        app.user.login(username, password, function() {
            app.router.navigate('dashboard', {trigger: false});
            app.reload();
        }, function(error) {
            self.enableForm('#login-form');
            self.$('#login-message').text(error.message);
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
