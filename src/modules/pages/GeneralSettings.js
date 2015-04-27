/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/general-settings.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageGeneralSettings
     * @extends GelatoPage
     */
    var PageGeneralSettings = GelatoPage.extend({
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
         * @method render
         * @returns {PageGeneralSettings}
         */
        render: function() {
            this.renderTemplate(Template);
            this.renderFields();
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageGeneralSettings}
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

    return PageGeneralSettings;

});