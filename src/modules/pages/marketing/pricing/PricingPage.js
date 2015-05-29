/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/pricing/pricing-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template,
    GelatoPage,
    Footer
) {

    /**
     * @class PricingPage
     * @extends GelatoPage
     */
    var PricingPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.footer = new Footer();
        },
        /**
         * @property title
         * @type String
         */
        title: 'Pricing - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PricingPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.footer.setElement(this.$('#footer-container')).render();
            return this;
        },
        /**
         * @method remove
         * @returns {PageHome}
         */
        remove: function() {
            this.footer.remove();
            return GelatoPage.prototype.remove.call(this);
        }
    });

    return PricingPage;

});