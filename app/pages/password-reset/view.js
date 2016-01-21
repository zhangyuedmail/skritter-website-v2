var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components1/marketing/footer/view');

/**
 * @class PasswordReset
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
        this.choices = [];
        this.errorMessage = null;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'keyup #input-field': 'handleKeyUpInputField',
        'vclick #button-reset': 'handleClickButtonReset'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Login - Skritter',
    /**
     * @method render
     * @returns {Login}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.footer.setElement('#footer-container').render();
        return this;
    },
    /**
     * @method handleClickButtonReset
     * @param {Event} event
     */
    handleClickButtonReset: function(event) {
        event.preventDefault();
        this.resetPassword();
    },
    /**
     * @method handleKeyUpInputField
     * @param {Event} event
     */
    handleKeyUpInputField: function(event) {
        event.preventDefault();
        if (event.which === 13 || event.keyCode === 13) {
            this.resetPassword();
        }
    },
    /**
     * @method resetPassword
     */
    resetPassword: function() {
        var self = this;
        var input = this.$('#password-reset-input').val();
        this.$('#password-reset-form').prop('disabled', true);
        this.errorMessage = null;
        ScreenLoader.show();
        ScreenLoader.post('Recovering user credentials');
        $.ajax({
            url: app.getApiUrl() + 'reset-password',
            type: 'POST',
            headers: app.user.session.getHeaders(),
            data: JSON.stringify({input: input}),
            error: function(error) {
                var response = error.responseJSON;
                if (response.choices) {
                    self.choices = _.sortBy(response.choices, 'name');
                } else {
                    self.errorMessage = response.message;
                    self.choices = [];
                }
                self.$('#password-reset-form').prop('disabled', false);
                self.render();
                ScreenLoader.hide();
            },
            success: function() {
                self.choices = [];
                self.successMessage = 'A temporary password has been emailed to you.';
                self.render();
                ScreenLoader.hide();
            }
        });
    },
    /**
     * @method remove
     * @returns {Login}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
