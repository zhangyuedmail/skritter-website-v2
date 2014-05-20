/**
 * @module Skritter
 * @submodule View
 * @param templateVocabLists
 * @param ListTable
 * @param VocabLists
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-lists.html',
    'view/component/ListTable',
    'collection/data/VocabLists'
], function(templateVocabLists, ListTable, VocabLists) {
    /**
     * @class Lists
     */
    var Lists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.lists = new VocabLists();
            this.category = 'studying';
            this.table = new ListTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            this.table.setElement(this.$('#lists')).render();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-category-studying': 'navigateCategoryStudying',
            'vclick .button-category-textbook': 'navigateCategoryTextbook'
        },
        /**
         * @method loadOfficial
         */
        loadOfficial: function() {
            this.$('.button-category-studying').removeClass('active');
            this.$('.button-category-textbook').addClass('active');
            skritter.modal.show('loading').set('.modal-body', 'Loading Lists');
            skritter.api.getVocabLists(_.bind(function(lists, status) {
                if (status === 200) {
                    this.table.set(lists, {
                        name: 'List Name',
                        peopleStudying: 'Studying'
                    });
                }
                skritter.modal.hide();
            }, this), {
                cursor: false,
                fields: ['id', 'name', 'peopleStudying'],
                lang: skritter.settings.getLanguageCode(),
                sort: 'official'
            });
        },
        /**
         * @method loadStudying
         */
        loadStudying: function() {
            this.$('.button-category-studying').addClass('active');
            this.$('.button-category-textbook').removeClass('active');
            skritter.modal.show('loading').set('.modal-body', 'Loading Lists');
            async.waterfall([
                function(callback) {
                    skritter.api.getVocabLists(function(studyingLists, status) {
                        if (status === 200) {
                            callback(null, studyingLists);
                        } else {
                            callback(studyingLists);
                        }
                    }, {
                        cursor: false,
                        fields: ['id', 'name', 'studyingMode'],
                        lang: skritter.settings.getLanguageCode(),
                        sort: 'studying'
                    });
                },
                function(lists, callback) {
                    skritter.api.getVocabLists(function(customLists, status) {
                        if (status === 200) {
                            callback(null, lists.concat(customLists));
                        } else {
                            callback(customLists);
                        }
                    }, {
                        cursor: false,
                        fields: ['id', 'name', 'studyingMode'],
                        lang: skritter.settings.getLanguageCode(),
                        sort: 'custom'
                    });
                }
            ], _.bind(function(error, lists) {
                if (error) {
                    this.$('#message').html(skritter.fn.bootstrap.alert('<strong>OFFLINE:</strong> Several list functions will be unavailable.', 'info'));
                    this.table.set(skritter.user.data.vocablists.toJSON(), {
                        name: 'List Name',
                        studyingMode: 'Status'
                    });
                    skritter.modal.hide();
                } else {
                    this.table.set(lists, {
                        name: 'List Name',
                        studyingMode: 'Status'
                    });
                    skritter.user.data.vocablists.reset();
                    skritter.user.data.vocablists.add(lists);
                    skritter.user.data.vocablists.cache(function() {
                        skritter.modal.hide();
                    });
                }
            }, this));
        },
        /**
         * @method navigateCategoryTextbook
         * @param {Object} event
         */
        navigateCategoryTextbook: function(event) {
            skritter.router.navigate('vocab/list/category/textbook', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateCategoryStudying
         * @param {Object} event
         */
        navigateCategoryStudying: function(event) {
            skritter.router.navigate('vocab/list/category/studying', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method set
         * @param {String} category
         * @returns {Backbone.View}
         */
        set: function(category) {
            this.category = category ? category : this.category;
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

    return Lists;
});