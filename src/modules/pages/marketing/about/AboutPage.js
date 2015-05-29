/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/about/about-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template,
    GelatoPage,
    FooterComponent
) {

    /**
     * @class AboutPage
     * @extends GelatoPage
     */
    var AboutPage = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.footer = new FooterComponent();
        },
        /**
         * @property title
         * @type String
         */
        title: 'About - ' + i18n.global.title,
        /**
         * @method render
         * @returns {AboutPage}
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

    return AboutPage;

});