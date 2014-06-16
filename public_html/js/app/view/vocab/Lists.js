define([
    'require.text!template/vocab-lists.html',
    'base/View',
    'view/component/ListTable'
], function(template, BaseView, ListTable) {
    /**
     * @class VocabLists
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.category = null;
            this.lists = new ListTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Lists - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            this.elements.userAvatar.html(skritter.user.getAvatar('img-circle'));
            this.lists.setElement(this.elements.lists).render();
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            this.elements.buttonOfficial = this.$('#button-category-textbook');
            this.elements.buttonStudying = this.$('#button-category-studying');
            this.elements.lists = this.$('#lists');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-category': 'handleCategoryClick'
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
         * @method loadOfficial
         */
        loadOfficial: function() {
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
            return this;
        },
        /**
         * @method loadStudying
         */
        loadStudying: function() {
            this.elements.buttonOfficial.removeClass('active');
            this.elements.buttonStudying.addClass('active');
            this.lists.set(skritter.user.data.vocablists.toJSON(), {
                name: 'Title',
                studyingMode: 'Status'
            });
            return this;
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

    return View;
});