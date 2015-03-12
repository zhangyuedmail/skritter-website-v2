/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/list-studying.html',
    'core/modules/GelatoPage',
    'modules/components/TableViewer'
], function(Template, GelatoPage, TableViewer) {

    /**
     * @class PageListStudying
     * @extends GelatoPage
     */
    var PageListStudying = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.lists = null;
            this.tableAdding = new TableViewer();
            this.tableReviewing = new TableViewer();
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.lists.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageListStudying}
         */
        render: function() {
            this.renderTemplate(Template);
            this.tableAdding.setElement(this.$('.adding-container')).render();
            this.tableReviewing.setElement(this.$('.reviewing-container')).render();
            this.tableAdding.hideSearchBar();
            this.tableReviewing.hideSearchBar();
            return this;
        },
        /**
         * @method renderTables
         * @returns {PageListStudying}
         */
        renderTables: function() {
            this.tableAdding.load(this.lists.getByAdding(), {
                name: 'Name',
                progress: {head: 'Progress', body: "{progress}"},
                study: {head: 'Study', type: 'link', body: "<div>Study list</div>"},
                stop: {head: 'Control', type: 'link', body: "<div>Stop adding</div>"}
            }, {hideHead: true});
            this.tableReviewing.load(this.lists.getByReviewing(), {
                name: 'Name',
                progress: {head: 'Progress', body: "{progress}"},
                study: {head: 'Study', type: 'link', body: "<div>Study list</div>"},
                stop: {head: 'Control', type: 'link', body: "<div>Stop adding</div>"}
            }, {hideHead: true});
            return this;
        },
        /**
         * @method load
         * @return {PageListStudying}
         */
        load: function() {
            var self = this;
            app.user.data.vocablists.fetch(function(lists) {
                self.lists = lists;
                self.renderTables();
            }, function(error) {
                console.log(error);
            });
            return this;
        }
    });

    return PageListStudying;

});