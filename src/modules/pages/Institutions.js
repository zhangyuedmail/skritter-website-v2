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
            this.$('#institution-datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {
            'vclick .request-purchase': 'handleClickRequestPurchase',
            'vclick .request-trial': 'handleClickRequestTrial'
        },
        /**
         * @method handleClickRequestPurchase
         * @param {Event} event
         */
        handleClickRequestPurchase: function(event) {
            event.preventDefault();
            var section = this.$("#section-request");
            $('html, body').animate({scrollTop: section.offset().top}, 1000);
            this.$('#institution-request-type [value="request-purchase"]').prop('checked', 'checked');
        },
        /**
         * @method handleClickRequestTrial
         * @param {Event} event
         */
        handleClickRequestTrial: function(event) {
            event.preventDefault();
            var section = this.$("#section-request");
            $('html, body').animate({scrollTop: section.offset().top}, 1000);
            this.$('#institution-request-type [value="request-trial"]').prop('checked', 'checked');
        }
    });

    return PageInstitutions;

});