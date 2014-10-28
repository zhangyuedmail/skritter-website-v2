/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/starred.html',
    'components/VocabTable'
], function(BasePage, TemplateMobile, VocabTable) {
    /**
     * @class PageStarred
     * @extends BasePage
     */
    var PageStarred = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Starred';
            this.table = new VocabTable();
        },
        /**
         * @method render
         * @returns {PageStarred}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.table.setElement(this.$('.starred-table-container')).render();
            this.loadStarred();
            this.resize();
            return this;
        },
        /**
         * @method loadStarred
         * @returns {PageStarred}
         */
        loadStarred: function() {
            var self = this;
            app.storage.getStarred(function(vocabs) {
                app.user.data.vocabs.set(vocabs, {merge: true});
                self.table.set({
                    writing: 'Writing',
                    reading: 'Reading',
                    starred: ''
                }, vocabs);
                self.table.renderTable();
            });
            return this;
        },
        /**
         * @method resize
         * @returns {PageStarred}
         */
        resize: function() {
            this.$('#starred').css({
                height: this.getHeight() - 25, //subtract 75 with search input
                'overflow-y': 'auto'
            });
            return this;
        }
    });

    return PageStarred;
});
