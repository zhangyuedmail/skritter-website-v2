/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/legal.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageLegal
     * @extends GelatoPage
     */
    var PageLegal = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
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
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {}
    });

    return PageLegal;

});