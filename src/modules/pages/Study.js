/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/study.html',
    'core/modules/GelatoPage',
    'modules/components/prompt/PromptComponent'
], function(
    Template,
    GelatoPage,
    PromptComponent
) {

    /**
     * @class PageStudy
     * @extends GelatoPage
     */
    var PageStudy = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.prompt = new PromptComponent();
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
            this.prompt.setElement(this.$('#prompt-container')).render();
            this.prompt.hide();
            return this;
        },
        /**
         * @method load
         * @param {String} [listId]
         * @param {String} [sectionId]
         * @returns {PageStudy}
         */
        load: function(listId, sectionId) {
            var self = this;
            app.user.data.items.loadNext(function(result) {
                self.prompt.set(result.getVocab().getPromptItems('rune'));
                self.prompt.show();
            }, function(error) {
                console.error(error);
            });
            return this;
        }
    });

    return PageStudy;

});