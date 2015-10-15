var GelatoPage = require('gelato/page');
var Vocabs = require('collections/vocabs');
var WordsSidebar = require('components/words-sidebar/view');
var ProgressDialog = require('dialogs/progress/view');
var VocabActionMixin = require('mixins/vocab-action');

/**
 * @class BannedWords
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = this.createComponent('navbars/default');
        this.sidebar = new WordsSidebar();
        this.bannedVocabs = new Vocabs();
        this.limit = 20;
        this.listenTo(this.bannedVocabs, 'sync', this.renderTable);
        this.fetchBannedVocabs();
    },
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #load-more-btn': 'handleClickLoadMoreButton',
        'change input[type="checkbox"]': 'handleChangeCheckbox',
        'vclick #unban-vocabs-btn': 'handleClickUnbanVocabsButton'
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
    title: 'Starred Words - Skritter',
    /**
     * @method fetchItems
     * @param {string} [cursor]
     */
    fetchBannedVocabs: function(cursor) {
        this.bannedVocabs.fetch({
            data: {
                sort: 'banned',
                limit: this.limit,
                cursor: cursor || ''
            },
            remove: false,
            sort: false
        });
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
        this.$('#unban-vocabs-btn').prop('disabled', !anyChecked);
    },
    /**
     * @method handleClickLoadMoreButton
     */
    handleClickLoadMoreButton: function() {
        this.fetchBannedVocabs(this.bannedVocabs.cursor);
    },
    /**
     * @method handleClickUnbanVocabsButton
     */
    handleClickUnbanVocabsButton: function() {
        var vocabs = new Vocabs();
        _.forEach(this.$('input:checked'), function(el) {
            var vocabID = $(el).closest('tr').data('vocab-id');
            if (!vocabID) {
                return;
            }
            vocabs.add(this.bannedVocabs.get(vocabID));
            this.bannedVocabs.remove(vocabID);
        }, this);
        this.beginVocabAction('unban', vocabs);
        this.renderTable();
        this.$('#unban-vocabs-btn').prop('disabled', true);
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
