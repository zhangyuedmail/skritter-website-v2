/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/Banned.html',
    'components/VocabTable'
], function(BasePage, TemplateMobile, VocabTable) {
    /**
     * @class PageBanned
     * @extends BasePage
     */
    var PageBanned = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Banned';
            this.table = new VocabTable();
        },
        /**
         * @method render
         * @returns {PageBanned}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.table.setElement(this.$('.banned-table-container')).render();
            this.loadBanned();
            this.resize();
            return this;
        },
        /**
         * @method loadBanned
         * @returns {PageBanned}
         */
        loadBanned: function() {
            var self = this;
            app.storage.getBanned(function(vocabs) {
                app.user.data.vocabs.set(vocabs, {merge: true});
                self.table.set({
                    writing: 'Writing',
                    reading: 'Reading',
                    banned: ''
                }, vocabs);
                self.table.renderTable();
            });
            return this;
        },
        /**
         * @method resize
         * @returns {PageBanned}
         */
        resize: function() {
            this.$('#banned').css({
                height: this.getHeight() - 25, //subtract 75 with search input
                'overflow-y': 'auto'
            });
            return this;
        }
    });

    return PageBanned;
});
