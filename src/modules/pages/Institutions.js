/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/institutions.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageInstitutions
     * @extends GelatoPage
     */
    var PageInstitutions = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Institutions - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageInstitutions}
         */
        render: function() {
            this.renderTemplate(Template);
            this.$('#institution-when').datetimepicker({format: 'YYYY-MM-DD'});
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {
            'vclick #request-trial-link': 'handleClickRequestTrialLink'
        },
        /**
         * @method handleClickRequestTrialLink
         * @param {Event} event
         */
        handleClickRequestTrialLink: function(event) {
            event.preventDefault();
            var section = this.$("#section-request");
            $('html, body').animate({scrollTop: section.offset().top}, 1000);
        }
    });

    return PageInstitutions;

});