/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/legal.html',
    'core/modules/GelatoPage',
    'modules/components/Footer'
], function(Template, GelatoPage, Footer) {

    /**
     * @class PageLegal
     * @extends GelatoPage
     */
    var PageLegal = GelatoPage.extend({
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
        title: 'Legal - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageLegal}
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

    return PageLegal;

});