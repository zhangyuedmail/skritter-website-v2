var GelatoNavbar = require('gelato/bootstrap/navbar');
var ConfirmLogoutDialog = require('dialogs/confirm-logout/view');

/**
 * @class DefaultNavbar
 * @extends {GelatoNavbar}
 */
module.exports = GelatoNavbar.extend({
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'click #button-logout': 'handleClickButtonLogout',
        'click .item-dropdown': 'handleClickDropdown'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {DefaultNavbar}
     */
    render: function() {
        this.renderTemplate();
        this.$('[data-toggle="tooltip"]').tooltip();
        return this;
    },
    /**
     * @method handleClickButtonLogout
     * @param {Event} event
     */
    handleClickButtonLogout: function(event) {
        event.preventDefault();
        var dialog = new ConfirmLogoutDialog();
        dialog.on('logout', function() {
            app.user.logout();
        });
        dialog.open();
    },
    /**
     * @method handleClickDropdown
     * @param {Event} event
     */
    handleClickDropdown: function(event) {
        event.preventDefault();
        var $dropdown = this.$('.item-dropdown');
        if ($dropdown.find('.dropdown').hasClass('hidden')) {
            $dropdown.addClass('open');
            $dropdown.find('.dropdown').removeClass('hidden');
        } else {
            $dropdown.removeClass('open');
            $dropdown.find('.dropdown').addClass('hidden');
        }
    }
});
