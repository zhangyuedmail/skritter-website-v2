var GelatoPage = require('gelato/page');
var ChangePasswordDialog = require('dialogs/change-password/view');

/**
 * @class SettingsGeneral
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.listenTo(app.user.settings, 'state', this.render);
        app.user.settings.fetch();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-save': 'handleClickButtonSave',
        'vclick #button-change-password': 'handleClickButtonChangePassword'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'General Settings - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {SettingsGeneral}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickButtonChangePassword
     * @param {Event} event
     */
    handleClickButtonChangePassword: function(event) {
        event.preventDefault();
        this.dialog = new ChangePasswordDialog();
        this.dialog.open();
    },
    /**
     * @method handleClickButtonSave
     * @param {Event} event
     */
    handleClickButtonSave: function(event) {
        event.preventDefault();
        app.user.settings.set({
            aboutMe: this.$('#field-about').val(),
            email: this.$('#field-email').val(),
            name: this.$('#field-name').val(),
            private: this.$('#field-private').is(':checked')
        }).save();
    },
    /**
     * @method remove
     * @returns {SettingsGeneral}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
