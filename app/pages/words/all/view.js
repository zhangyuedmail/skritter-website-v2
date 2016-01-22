var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var Items = require('collections/items');
var Vocabs = require('collections/vocabs');
var WordsSidebar = require('components1/words/sidebar/view');
var VocabDialog = require('dialogs/vocab/view');
var VocabActionMixin = require('mixins/vocab-action');

/**
 * @class AllWords
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new WordsSidebar();
        this.items = new Items();
        this.searchVocabs = new Vocabs();
        this.vocabsToFetchItemsFor = new Vocabs();
        this.searchVocabItems = new Items();
        this.vocabMap = {};
        this.sort = 'last';
        this.limit = 20;
        this.searchString = '';
        this.initAllCollections();
        this.fetchItems();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick .writing-td': 'handleClickWritingTd',
        'vclick #load-more-btn': 'handleClickLoadMoreButton',
        'vclick #next-sort-link': 'handleClickNextSortLink',
        'vclick #previous-sort-link': 'handleClickPreviousSortLink',
        'change input[type="checkbox"]': 'handleChangeCheckbox',
        'change #action-select': 'handleChangeActionSelect',
        'change #word-search-input': 'handleChangeWordSearchInput'
    },
    /**
     * @method remove
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#words-sidebar-container').render();
        return this;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'All Words - Skritter',
    /**
     * @method fetchItems
     * @param {string} [cursor]
     */
    fetchItems: function(cursor) {
        this.items.fetch({
            data: {
                sort: this.sort,
                limit: this.limit,
                include_vocabs: true,
                cursor: cursor || ''
            },
            remove: false,
            sort: false
        });
    },
    /**
     * @method fetchItemsForSearchVocabs
     */
    fetchItemsForSearchVocabs: function() {
        var vocabs = this.vocabsToFetchItemsFor.slice(0, 5);
        if (!vocabs.length) {
            return;
        }
        this.stopListening(this.searchVocabItems);
        this.searchVocabItems = new Items();
        this.searchVocabItems.fetch({
            data: {
                vocab_ids: _.map(vocabs, 'id').join('|')
            }
        });
        this.searchVocabItems.vocabs = vocabs;
        this.listenToOnce(this.searchVocabItems, 'sync', this.fetchItemsForSearchVocabsSync);
    },
    /**
     * @method fetchItemsForSearchVocabsSync
     */
    fetchItemsForSearchVocabsSync: function(items, response) {
        var vocabs = items.vocabs;
        _.forEach(vocabs, function(vocab) {
            // having gotten items for each vocab, assign each vocab
            // its last-studied and next-to-study item
            var vocabItemKeys = response.vocabItemMap[vocab.id];
            var vocabItems = _.map(vocabItemKeys, function(vocabItemKey) {
                var item = items.get(vocabItemKey);
                // TODO: Also filter out items which whose parts
                // or style are not being studied.
                if (!item || !(item.get('vocabIds') || []).length) {
                    return null;
                }
                return items.get(vocabItemKey);
            });
            vocabItems = _.filter(vocabItems); // return
            vocab.nextItem = _.head(_.sortBy(vocabItems, function(item) {
                return item.get('next') || 10000000000000000;
            }));
            vocab.lastItem = _.last(_.sortBy(vocabItems, function(item) {
                return item.get('last') || 0;
            }));
            vocab.set('itemState', 'fetched');
        }, this);
        this.vocabsToFetchItemsFor.remove(vocabs);
        this.renderTable();
        this.fetchItemsForSearchVocabs();
    },
    /**
     * Initializes the action object runAction uses to serially process words
     * @method handleChangeActionSelect
     */
    handleChangeActionSelect: function(e) {
        var action = $(e.target).val();
        if (!action) {
            return;
        }
        $(e.target).val('');
        var vocabs = new Vocabs();
        _.forEach(this.$('input:checked'), function(el) {
            var vocabID = $(el).closest('tr').data('vocab-id');
            if (!vocabID) {
                return;
            }
            vocabs.add(
              this.items.vocabs.get(vocabID) || this.searchVocabs.get(vocabID));
        }, this);

        this.$('input[type="checkbox"]').attr('checked', false);
        this.beginVocabAction(action, vocabs);
    },
    /**
     * @method handleChangeCheckbox
     * @param {Event} event
     */
    handleChangeCheckbox: function(event) {
        var checkbox = $(event.target);
        if (checkbox.attr('id') === 'all-checkbox') {
            this.$('input[type="checkbox"]').prop('checked', checkbox.prop('checked'));
        }
        var anyChecked = this.$('input[type="checkbox"]:checked').length;
        this.$('#action-select').prop('disabled', !anyChecked);
    },
    /**
     * @method handleChangeWordSearchInput
     */
    handleChangeWordSearchInput: function() {
        this.initAllCollections();
        this.searchString = this.$('#word-search-input').val();
        if (this.searchString) {
            this.searchVocabs.fetch({
                data: {
                    q: this.searchString,
                    limit: this.limit,
                    include_containing: true
                }
            });
        }
        else {
            this.fetchItems();
        }
    },
    /**
     * @method handleClickLoadMoreButton
     */
    handleClickLoadMoreButton: function() {
        if (this.searchString) {
            this.searchVocabs.fetch({
                data: {
                    q: this.searchString,
                    cursor: this.searchVocabs.cursor,
                    containing_cursor: this.searchVocabs.containingCursor,
                    limit: this.limit,
                    include_containing: true
                },
                remove: false
            })
        }
        else {
            this.fetchItems(this.items.cursor);
        }
    },
    /**
     * @method handleClickNextSortLink
     */
    handleClickNextSortLink: function() {
        this.sort = 'next';
        this.initAllCollections();
        this.fetchItems();
    },
    /**
     * @method handleClickPreviousSortLink
     */
    handleClickPreviousSortLink: function() {
        this.sort = 'last';
        this.initAllCollections();
        this.fetchItems();
    },
    /**
     * @method handleClickWritingTd
     * @param {Event} event
     */
    handleClickWritingTd: function(event) {
        event.preventDefault();
        var row = $(event.target).parent('tr');
        var vocabId = row.data('vocab-id');
        if (vocabId) {
            var dialog = new VocabDialog();
            dialog.open().load(vocabId);
        }
    },
    /**
     * @method initAllCollections
     */
    initAllCollections: function() {
        this.stopListening(this.items);
        this.stopListening(this.items.vocabs);
        this.stopListening(this.vocabs);
        this.stopListening(this.vocabsToFetchItemsFor);
        this.stopListening(this.searchVocabItems);

        this.vocabsToFetchItemsFor = new Vocabs();
        this.items = new Items();
        this.searchVocabs = new Vocabs();
        this.vocabsToFetchItemsFor = new Vocabs();
        this.searchVocabItems = new Items();
        this.vocabMap = {};

        this.listenTo(this.items.vocabs, 'add', function(vocab) {
            this.vocabMap[vocab.id] = vocab;
        });
        this.listenTo(this.items, 'state', this.renderTable);
        this.listenTo(this.searchVocabs, 'state', this.renderTable);
        this.listenTo(this.searchVocabs, 'add', function(vocab) {
            this.vocabsToFetchItemsFor.add(vocab);
            vocab.set('itemState', 'queued')
        });
        this.listenTo(this.searchVocabs, 'sync', this.fetchItemsForSearchVocabs);
    },
    /**
     * @method renderTable
     */
    renderTable: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('.table-oversized-wrapper').replaceWith(rendering.find('.table-oversized-wrapper'));
    }
});

_.extend(module.exports.prototype, VocabActionMixin);
