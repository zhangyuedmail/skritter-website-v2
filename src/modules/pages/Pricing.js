/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/pricing.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PagePricing
     * @extends GelatoPage
     */
    var PagePricing = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Pricing - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PagePricing}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        }
    });

    return PagePricing;

});