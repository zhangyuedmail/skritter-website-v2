/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/footer.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class Footer
     * @extends GelatoComponent
     */
    var Footer = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @method render
         * @returns {Footer}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {}
    });

    return Footer;

});