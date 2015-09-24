var GelatoDialog = require('gelato/dialog');

/**
 * @class ConfirmLogoutDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('dialogs/confirm-logout/template'),
    /**
     * @method render
     * @returns {ConfirmLogoutDialog}
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
        'vclick #button-cancel': 'handleClickButtonCancel',
        'vclick #button-logout': 'handleClickButtonLogout'
    },
    /**
     * @method handleClickButtonCancel
     * @param {Event} event
     */
    handleClickButtonCancel: function(event) {
        event.preventDefault();
        app.closeDialog();
    },
    /**
     * @method handleClickButtonLogout
     * @param {Event} event
     */
    handleClickButtonLogout: function(event) {
        event.preventDefault();
        app.closeDialog();
    }
});
