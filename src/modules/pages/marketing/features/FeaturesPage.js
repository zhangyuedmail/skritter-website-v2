/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!modules/pages/marketing/features/features-template.html',
    'core/modules/GelatoPage',
    'modules/components/marketing/footer/FooterComponent'
], function(
    Template,
    GelatoPage,
    Footer
) {

    /**
     * @class FeaturesPage
     * @extends GelatoPage
     */
    var FeaturesPage = GelatoPage.extend({
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
        title: 'Features - ' + i18n.global.title,
        /**
         * @method render
         * @returns {FeaturesPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.footer.setElement(this.$('#footer-container')).render();
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method remove
         * @returns {PageHome}
         */
        remove: function() {
            this.footer.remove();
            return GelatoPage.prototype.remove.call(this);
        }
    });

    return FeaturesPage;

});