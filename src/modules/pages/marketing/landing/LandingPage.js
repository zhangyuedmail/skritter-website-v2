/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/landing/landing-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template, 
    GelatoPage, 
    Footer
) {

    /**
     * @class LandingPage
     * @extends GelatoPage
     */
    var LandingPage = GelatoPage.extend({
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
        title: 'Landing - ' + i18n.global.title,
        /**
         * @method render
         * @returns {LandingPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.footer.setElement(this.$('#footer-container')).render();
            return this;
        },
        /**
         * @method remove
         * @returns {LandingPage}
         */
        remove: function() {
            this.footer.remove();
            return GelatoPage.prototype.remove.call(this);
        }
    });

    return LandingPage;

});