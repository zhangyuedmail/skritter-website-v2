/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/about.html',
    'core/modules/GelatoPage',
    'modules/components/Footer'
], function(Template, GelatoPage, Footer) {

    /**
     * @class PageAbout
     * @extends GelatoPage
     */
    var PageAbout = GelatoPage.extend({
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
        title: 'About - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageAbout}
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

    return PageAbout;

});