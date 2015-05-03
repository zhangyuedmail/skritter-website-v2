/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/features.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageFeatures
     * @extends GelatoPage
     */
    var PageFeatures = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Features - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageFeatures}
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

    return PageFeatures;

});