var GelatoPage = require('gelato/page');
var ChangePasswordDialog = require('dialogs/change-password/view');
var SettingsSidebar = require('components/settings-sidebar/view');
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
        this.navbar = new DefaultNavbar().render();
        this.sidebar = new SettingsSidebar();
        this.listenTo(app.user, 'state', this.renderSectionContent);
        app.user.fetch();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'change #field-country': 'handleSelectCountry',
        'click #button-save': 'handleClickButtonSave',
        'click #button-change-password': 'handleClickButtonChangePassword'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'General Settings - Skritter',
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
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
        this.sidebar.setElement(this.$('#settings-sidebar-container')[0]).render();
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
    },
    /**
     * @method renderSectionContent
     */
    renderSectionContent: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('#section-content').replaceWith(rendering.find('#section-content'));
    }
});
