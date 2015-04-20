/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-create.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageListCreate
     * @extends GelatoPage
     */
    var PageListCreate = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: 'Create List - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageListCreate}
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

    return PageListCreate;

});