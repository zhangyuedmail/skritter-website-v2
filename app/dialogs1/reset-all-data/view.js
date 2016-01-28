var GelatoDialog = require('base/gelato-dialog');

/**
 * @class ResetAllDataDialog
 * @extends {GelatoDialog}
 */
var ResetAllDataDialog = GelatoDialog.extend({
    /**
     * @method initialize
     * @param {Object} options
     */
    initialize: function(options) {},
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-cancel': 'handleClickButtonCancel',
        'vclick #button-confirm': 'handleClickButtonConfirm'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {ResetAllDataDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickButtonCancel
     * @param {Event} event
     */
    handleClickButtonCancel: function(event) {
        event.preventDefault();
        this.close();
    },
    /**
     * @method handleClickButtonConfirm
     * @param {Event} event
     */
    handleClickButtonConfirm: function(event) {
        event.preventDefault();
        ScreenLoader.show();
        ScreenLoader.post('Resetting account data');
        $.ajax({
            data: {
                lang: app.getLanguage(),
                password: this.$('#input-password').val()
            },
            headers: app.user.session.getHeaders(),
            type: 'POST',
            url: app.getApiUrl() + 'reset',
            error: function(error) {
                ScreenLoader.hide();
                self.$('#error-message').text(error.responseJSON.message);
            },
            success: function() {
                app.user.setLastItemUpdate(0);
                app.user.cache();
                app.router.navigate('dashboard');
                app.reload();
            }
        });
    }
});

module.exports = ResetAllDataDialog;
