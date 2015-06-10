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
            this.item = null;
            this.listId = null;
            this.prompt = new PromptComponent();
            this.sectionId = null;
            this.listenTo(this.prompt, 'complete', this.handlePromptComplete);
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
         * @method handlePromptComplete
         * @param {PromptReviews} reviews
         */
        handlePromptComplete: function(reviews) {
            this.item.set('next', 9999999999999);
            this.loadNext();
        },
        /**
         * @method load
         * @param {String} [listId]
         * @param {String} [sectionId]
         * @returns {StudyPage}
         */
        load: function(listId, sectionId) {
            this.listId = listId || null;
            this.sectionId = sectionId || null;
            this.loadNext();
            return this;
        },
        /**
         * @method loadNext
         * @returns {StudyPage}
         */
        loadNext: function() {
            var self = this;
            app.user.data.items.loadNext(function(result) {
                self.item = result;
                self.prompt.set(result.getPromptReviews());
            }, function(error) {
                console.error(error);
            });
            return this;
        }
    });

    return StudyPage;

});