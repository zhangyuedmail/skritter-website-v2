var GelatoPage = require('gelato/page');

var AccountSidebar = require('../../sidebar/view');
var DefaultNavbar = require('navbars/default/view');

var ChangePasswordDialog = require('dialogs/change-password/view');

/**
 * @class AccountSettingsGeneral
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.countries = require('data/country-codes');
        this.timezones = require('data/country-timezones');
        this.navbar = new DefaultNavbar();
        this.sidebar = new AccountSidebar();
        this.listenTo(app.user, 'state', this.render);
        app.user.fetch();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'change #avatar-upload-input': 'handleChangeAvatarUploadInput',
        'change #field-country': 'handleSelectCountry',
        'vclick #button-save': 'handleClickButtonSave',
        'vclick #button-change-password': 'handleClickButtonChangePassword',
        'vclick #change-avatar': 'handleClickChangeAvatar'
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
     * @returns {AccountSettingsGeneral}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#sidebar-container').render();
        return this;
    },
    /**
     * @method getSelectedCountryCode
     * @returns {String}
     */
    getSelectedCountryCode: function() {
        return this.$('#field-country :selected').val() || app.user.get('country');
    },
    /**
     * @method handleChangeAvatarUploadInput
     * @param {Event} event
     */
    handleChangeAvatarUploadInput: function(event) {
        var file = event.target.files[0];
        var data = new FormData().append('image', file);
        var reader  = new FileReader();
        reader.onload = function(event) {
            $('#field-avatar').attr('src', event.target.result);
        };
        reader.readAsDataURL(file);
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
        app.user.set({
            avatar: this.$('#field-avatar').get(0).src.replace('data:image/png;base64,', ''),
            aboutMe: this.$('#field-about').val(),
            country: this.$('#field-country').find(':selected').val(),
            email: this.$('#field-email').val(),
            name: this.$('#field-name').val(),
            private: this.$('#field-private').is(':checked'),
            timezone: this.$('#field-timezone :selected').val()
        }).save();
    },
    /**
     * @method handleClickChangeAvatar
     * @param {Event} event
     */
    handleClickChangeAvatar: function(event) {
        event.preventDefault();
        this.$('#avatar-upload-input').trigger('click');
    },
    /**
     * @method handleSelectCountry
     * @param event
     */
    handleSelectCountry: function(event) {
        event.preventDefault();
        this.render();
    },
    /**
     * @method remove
     * @returns {AccountSettingsGeneral}
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
