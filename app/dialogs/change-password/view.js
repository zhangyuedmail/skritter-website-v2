var GelatoDialog = require('gelato/bootstrap/dialog');

/**
 * @class ChangePasswordDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {ChangePasswordDialog}
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
        'vclick #button-change': 'handleClickButtonChange',
        'vclick #button-close': 'handleClickButtonClose'
    },
    /**
     * @method handleClickButtonClose
     * @param {Event} event
     */
    handleClickButtonClose: function(event) {
        event.preventDefault();
        this.close();
    },
    /**
     * @method handleClickButtonChange
     * @param {Event} event
     */
    handleClickButtonChange: function(event) {
        event.preventDefault();
        var password1 = this.$('#field-password1').val();
        var password2 = this.$('#field-password2').val();
        this.$('#error-message').empty();
        this.$('form').prop('disabled', true);
        if (password1 !== password2) {
            this.$('#error-message').text("Passwords must match.");
            this.$('form').prop('disabled', false);
            return;
        }
        app.user.save(
            {
                password: password1
            },
            {
                error: (function(error) {
                    this.$('#error-message').text(JSON.stringify(error));
                    this.$('form').prop('disabled', false);
                }).bind(this),
                success: (function() {
                    this.close();
                }).bind(this)
            }
        );
    }
});
