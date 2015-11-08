var BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class ConfirmBanDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {ConfirmBanDialog}
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
        'vclick #button-ban': 'handleClickButtonBan',
        'vclick #button-cancel': 'handleClickButtonCancel'
    },
    /**
     * @method handleClickButtonBan
     * @param {Event} event
     */
    handleClickButtonBan: function(event) {
        event.preventDefault();
        this.trigger('ban');
    },
    /**
     * @method handleClickButtonCancel
     * @param {Event} event
     */
    handleClickButtonCancel: function(event) {
        event.preventDefault();
        this.close();
    }
});
