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
            this.counter = 0;
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
                app.user.history.save();
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
            app.user.data.items.fetchNext(10, function() {
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
            var item = app.user.data.items.getNext();
            if (item) {
                this.counter++;
                this.item = item;
                this.prompt.set(item.getPromptReviews());
                this.prompt.show();
                if (this.counter % 5 === 0) {
                    console.log('FETCHING ITEMS:', 5);
                    app.user.data.items.fetch(5);
                }
            } else {
                console.error(new Error('Unable to get next item.'));
            }
            return this;
        }
    });

    return StudyPage;

});