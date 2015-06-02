/**
 * @module Application
 * @submodule Pages
 */
define([
    'core/modules/GelatoPage',
    'require.text!modules/pages/study/study-template.html',
    'modules/components/prompt/PromptComponent'
], function(
    GelatoPage,
    Template,
    PromptComponent
) {

    /**
     * @class StudyPage
     * @extends GelatoPage
     */
    var StudyPage = GelatoPage.extend({
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
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {StudyPage}
         */
        render: function() {
            this.renderTemplate(Template);
            this.prompt.setElement(this.$('#prompt-container')).render();
            return this;
        },
        /**
         * @method load
         * @param {String} [listId]
         * @param {String} [sectionId]
         * @returns {StudyPage}
         */
        load: function(listId, sectionId) {
            var self = this;
            app.user.data.items.loadNext(function(result) {
                self.prompt.set(result.getVocab().getPromptItems('rune'));
            }, function(error) {
                console.error(error);
            });
            return this;
        }
    });

    return StudyPage;

});