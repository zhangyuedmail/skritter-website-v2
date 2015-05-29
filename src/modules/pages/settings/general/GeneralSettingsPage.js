/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/settings/general/general-settings-template.html',
    'core/modules/GelatoPage'
], function(
    Template, 
    GelatoPage
) {

    /**
     * @class GeneralSettingsPage
     * @extends GelatoPage
     */
    var GeneralSettingsPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'General Settings - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {GeneralSettingsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.renderFields();
            return this;
        },
        /**
         * @method renderFields
         * @returns {GeneralSettingsPage}
         */
        renderFields: function() {
            var userSettings = app.user.settings;
            this.$('#user-avatar').html(userSettings.getAvatar());
            this.$('#user-description').text(userSettings.get('description'));
            this.$('#user-email').text(userSettings.get('email'));
            this.$('#user-id').text(userSettings.get('id'));
            this.$('#user-name').text(userSettings.get('name'));
            this.$('#user-private').prop('checked', userSettings.get('private'));
            return this;
        },
        /**
         * @property events
         * @typeof {Object}
         */
        events: {}
    });

    return GeneralSettingsPage;

});