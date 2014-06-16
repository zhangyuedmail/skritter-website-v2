define([
    'require.text!template/component-list-section-row-table.html'
], function(template) {
    /**
     * @class VocabListSectionRowTable
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.listId = null;
            this.sectionId = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(template);
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
        }
    });

    return View;
});