/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!modules/components/marketing/footer/footer-template.html',
    'core/modules/GelatoComponent'
], function(
    Template,
    GelatoComponent
) {

    /**
     * @class FooterComponent
     * @extends GelatoComponent
     */
    var FooterComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @method render
         * @returns {FooterComponent}
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

    return FooterComponent;

});