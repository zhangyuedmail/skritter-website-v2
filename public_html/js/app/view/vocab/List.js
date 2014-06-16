define([
    'require.text!template/vocab-list.html',
    'base/View',
    'view/component/ListSectionTable'
], function(template, BaseView, ListSectionTable) {
    /**
     * @class VocabList
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.listId = null;
            this.sections = new ListSectionTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "List - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.sections.setElement(this.elements.listSections).render();
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.listDescription = this.$('.list-description');
            this.elements.listName = this.$('.list-name');
            this.elements.listSections = this.$('#list-sections');
            return this;
        },
        /**
         * @method loadList
         */
        loadList: function() {
            skritter.modal.show('loading').set('.message', 'Loading List');
            skritter.api.getVocabList(this.listId, null, _.bind(function(list) {
                this.elements.listDescription.text(list.description);
                this.elements.listName.text(list.name);
                this.sections.set(this.listId, list.sections, {
                    name: 'Name',
                    rows: 'Items'
                });
                skritter.modal.hide();
            }, this));
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
        set: function(listId) {
            this.listId = listId;
            this.loadList();
            return this;
        }
    });

    return View;
});