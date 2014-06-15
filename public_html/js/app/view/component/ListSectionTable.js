define([
    'require.text!template/component-list-section-table.html'
], function(template) {
    /**
     * @class VocabListSectionTable
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
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