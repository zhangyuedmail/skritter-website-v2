/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/settings/study/study-settings-template.html',
    'core/modules/GelatoPage'
], function(
    Template,
    GelatoPage
) {

    /**
     * @class StudySettingsPage
     * @extends GelatoPage
     */
    var StudySettingsPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'Study Settings - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {StudySettingsPage}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @typeof {Object}
         */
        events: {}
    });

    return StudySettingsPage;

});