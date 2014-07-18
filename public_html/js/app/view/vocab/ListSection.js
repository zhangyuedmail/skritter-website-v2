define([
    'require.text!template/vocab-list-section.html',
    'view/View',
    'view/component/ListSectionRowTable',
    'view/component/Sidebar'
], function(template, View, ListSectionRowTable, Sidebar) {
    /**
     * @class VocabListSection
     */
    var VocabListSection = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
            this.listId = null;
            this.rows = new ListSectionRowTable();
            this.section = null;
            this.sectionId = null;
            this.sidebar = new Sidebar();
        },
        /**
         * @method render
         * @returns {VocabListSection}
         */
        render: function() {
            this.setTitle('Section');
            this.$el.html(_.template(template, skritter.strings));
            this.sidebar.setElement(this.$('.sidebar')).render();
            this.loadElements();
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.rows.setElement(this.elements.listRows).render();
            return this;
        },
        /**
         * @method loadElements
         */
        loadElements: function() {
            this.elements.listName = this.$('.list-name');
            this.elements.listRows = this.$('#list-section');
            this.elements.sectionName = this.$('.section-name');
            this.elements.userAvatar = this.$('.user-avatar');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, View.prototype.events, {
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

    return VocabListSection;
});