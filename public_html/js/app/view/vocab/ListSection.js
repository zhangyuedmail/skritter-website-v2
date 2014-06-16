define([
    'require.text!template/vocab-list-section.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class VocabListSection
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Section - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
            });
        },
        /**
         * @method set
         * @param {String} listId
         * @returns {Backbone.View}
         */
        set: function(listId, sectionId) {
            this.listId = listId;
            this.sectionId = sectionId;
            return this;
        }
    });

    return View;
});