/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/study-settings.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageStudySettings
     * @extends GelatoPage
     */
    var PageStudySettings = GelatoPage.extend({
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
         * @returns {PageStudySettings}
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

    return PageStudySettings;

});