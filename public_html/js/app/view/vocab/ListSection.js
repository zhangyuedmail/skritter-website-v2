define([
    'require.text!template/vocab-list-section.html',
    'base/View',
    'view/component/ListSectionRowTable'
], function(template, BaseView, ListSectionRowTable) {
    /**
     * @class VocabListSection
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.listId = null;
            this.rows = new ListSectionRowTable();
            this.section = null;
            this.sectionId = null;
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
            this.rows.setElement(this.elements.listRows).render();
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.listName = this.$('.list-name');
            this.elements.listRows = this.$('#list-section');
            this.elements.sectionName = this.$('.section-name');

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
         * @method loadSection
         */
        loadSection: function() {
            var listId = this.listId;
            var sectionId = this.sectionId;
            skritter.modal.show('loading').set('.message', 'Loading Section');
            skritter.api.getVocabList(listId, null, _.bind(function(list) {
                this.section = _.find(list.sections, {id: this.sectionId});
                this.elements.listName.text(list.name);
                this.elements.sectionName.text(this.section.name);
                this.rows.set(this.listId, this.section, {
                    vocabId: 'Item'
                });
                skritter.modal.hide();
            }, this));
            return this;
        },
        /**
         * @method set
         * @param {String} listId
         * @param {String} sectionId
         * @returns {Backbone.View}
         */
        set: function(listId, sectionId) {
            this.listId = listId;
            this.sectionId = sectionId;
            this.loadSection();
            return this;
        }
    });

    return View;
});