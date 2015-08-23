var GelatoPage = require('gelato/page');
var ChangePasswordDialog = require('dialogs/change-password/view');
var DefaultNavbar = require('navbars/default/view');

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
        this.countries = require('data/country-codes');
        this.timezones = require('data/country-timezones');
        this.navbar = new DefaultNavbar();
        this.listenTo(app.user.settings, 'state', this.render);
        app.user.settings.fetch();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'change #field-country': 'handleSelectCountry',
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
        this.navbar.render();
        return this;
    },
    /**
     * @method getSelectedCountryCode
     * @returns {String}
     */
    getSelectedCountryCode: function() {
        return this.$('#field-country').find(':selected').val() || app.user.settings.get('country');
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
        console.log(this.$('#field-country :selected').val());
        app.user.settings.set({
            aboutMe: this.$('#field-about').val(),
            country: this.$('#field-country').find(':selected').val(),
            email: this.$('#field-email').val(),
            name: this.$('#field-name').val(),
            private: this.$('#field-private').is(':checked'),
            timezone: this.$('#field-timezone :selected').val()
        }).save();
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
     * @returns {SettingsGeneral}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
