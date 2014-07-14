define([
    'require.text!template/vocab-lists.html',
    'view/View',
    'view/component/ListTable'
], function(template, View, ListTable) {
    /**
     * @class VocabLists
     */
    var VocabLists = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
            this.category = null;
            this.lists = new ListTable();
        },
        /**
         * @method render
         * @returns {VocabLists}
         */
        render: function() {
            this.setTitle('Lists');
            this.$el.html(_.template(template, skritter.strings));
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.lists.setElement(this.elements.lists).render();
            this.resize();
            return this;
        },
        /**
         * @method loadElements
         */
        loadElements: function() {
            this.elements.blockLists = this.$('#block-lists');
            this.elements.blockSearch = this.$('#block-search');
            this.elements.blockSort = this.$('#block-sort');
            this.elements.buttonOfficial = this.$('#button-category-textbook');
            this.elements.buttonStudying = this.$('#button-category-studying');
            this.elements.inputSearch = this.$('#input-search');
            this.elements.lists = this.$('#lists');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, View.prototype.events, {
                'vclick .button-category': 'handleCategoryClick',
                'keyup #input-search': 'handleEnterPress',
                'vclick .button-search': 'handleSearchClick'
            });
        },
        /**
         * @method handleCategoryClick
         * @param {Object} event
         */
        handleCategoryClick: function(event) {
            var category = event.currentTarget.id.replace('button-category-', '');
            this.set(category);
            skritter.router.navigate('vocab/list/category/' + category, {replace: true, trigger: false});
            event.preventDefault();
        },
        /**
         * @method handleEnterPress
         * @param {Object} event
         */
        handleEnterPress: function(event) {
            if (event.keyCode === 13) {
                this.handleSearchClick(event);
            } else {
                event.preventDefault();
            }
        },
        /**
         * @method handleSearchClick
         * @param {Object} event
         */
        handleSearchClick: function(event) {
            var title = this.elements.inputSearch.val();
            this.lists.filterByTitle(title);
            event.preventDefault();
        },
        /**
         * @method loadOfficial
         */
        loadOfficial: function() {
            this.elements.inputSearch.val('');
            this.elements.buttonOfficial.addClass('active');
            this.elements.buttonStudying.removeClass('active');
            skritter.modal.show('loading').set('.message', 'Loading Textbooks');
            skritter.api.getVocabLists(_.bind(function(lists) {
                this.lists.set(lists, {
                    name: 'Title',
                    studyingMode: 'Status'
                });
                skritter.modal.hide();
            }, this), {
                lang: skritter.user.getLanguageCode(),
                sort: 'official'
            });
            return this;
        },
        /**
         * @method loadStudying
         */
        loadStudying: function() {
            this.elements.inputSearch.val('');
            this.elements.buttonOfficial.removeClass('active');
            this.elements.buttonStudying.addClass('active');
            this.lists.set(skritter.user.data.vocablists.toJSON(), {
                name: 'Title',
                studyingMode: 'Status'
            });
            return this;
        },
        /**
         * @method resize
         */
        resize: function() {
            var contentHeight = skritter.settings.getContentHeight();
            this.elements.blockLists.height(contentHeight - this.elements.blockSearch.outerHeight() - this.elements.blockSort.outerHeight() - 50);
        },
        /**
         * @method set
         * @param {String} category
         * @returns {Backbone.View}
         */
        set: function(category) {
            this.category = category ? category : 'studying';
            switch (this.category) {
                case 'studying':
                    this.loadStudying();
                    break;
                case 'textbook':
                    this.loadOfficial();
                    break;
                default:
                    this.loadStudying();
                    break;
            }
            return this;
        }
    });

    return VocabLists;
});