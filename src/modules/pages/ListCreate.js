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
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Create List - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
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
        events: {
            'vclick #create-list-submit': 'handleSubmitCreateList'
        },
        /**
         * @method handleSubmitCreateList
         * @param {Event} event
         */
        handleSubmitCreateList: function(event) {
            event.preventDefault();
            var listDescription = this.$('#list-description').val();
            var listName = this.$('#list-name').val();
            app.api.createVocabList({
                description: listDescription,
                lang: app.user.getLanguageCode(),
                name: listName
            }, function(list) {
                app.router.navigate('lists/browse/' + list.id, {replace: true, trigger: true});
            }, function(error) {
                console.error('VOCABLIST CREATE ERROR:', error);
            });
        }
    });

    return PageListCreate;

});