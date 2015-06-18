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
            this.prompt.hide();
            return this;
        },
        /**
         * @method handlePromptComplete
         * @param {PromptReviews} reviews
         */
        handlePromptComplete: function(reviews) {
            var self = this;
            reviews.updateItems(function() {
                self.loadNext();
            }, function(error) {
                console.error('ITEM UPDATE ERROR:', error);
            });
        },
        /**
         * @method load
         * @param {String} [listId]
         * @param {String} [sectionId]
         * @returns {StudyPage}
         */
        load: function(listId, sectionId) {
            var self = this;
            this.listId = listId || null;
            this.sectionId = sectionId || null;
             app.user.data.items.fetchNext(function() {
                self.loadNext();
            }, function(error) {
                console.error(error);
            });
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
                self.prompt.set(self.item.getPromptReviews());
                self.prompt.show();
            }, function(error) {
                console.error(error);
            });
            return this;
        }
    });

    return StudyPage;

});