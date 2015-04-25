/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/study.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageStudy
     * @extends GelatoPage
     */
    var PageStudy = GelatoPage.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.app = options.app;
        },
        /**
         * @property title
         * @type String
         */
        title: 'Study - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @method load
         * @param {String} listId
         * @param {String} sectionId
         * @returns {PageStudy}
         */
        load: function(listId, sectionId) {
            return this;
        }
    });

    return PageStudy;

});