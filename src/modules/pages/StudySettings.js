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
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
        },
        /**
         * @property title
         * @type String
         */
        title: 'Study Settings - ' + i18n.global.title,
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