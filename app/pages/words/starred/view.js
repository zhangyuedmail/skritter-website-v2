var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var Vocabs = require('collections/vocabs');
var WordsSidebar = require('components/words/sidebar/view');
var ProgressDialog = require('dialogs/progress/view');
var VocabActionMixin = require('mixins/vocab-action');

/**
 * @class StarredWords
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
        this.starredVocabs = new Vocabs();
        this.limit = 20;
        this.listenTo(this.starredVocabs, 'sync', this.renderTable);
        this.fetchStarredVocabs();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'click #load-more-btn': 'handleClickLoadMoreButton',
        'click #remove-all-stars-link': 'fetchAllStarredVocabsThenRemoveThem',
        'click .star-td a': 'handleClickStarLink'
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
     * @method fetchAllStarredVocabsThenRemoveThem
     */
    fetchAllStarredVocabsThenRemoveThem: function() {
        if (this.starredVocabs.cursor) {
            if (!this.getAllVocabsDialog) {
                this.getAllVocabsDialog = new ProgressDialog({
                    title: 'Loading starred words',
                    showBar: false
                });
                this.getAllVocabsDialog.render().open();
                this.getAllVocabsDialog.setProgress(100);
            }
            this.fetchStarredVocabs(this.starredVocabs.cursor);
            this.listenToOnce(this.starredVocabs, 'sync', this.fetchAllStarredVocabsThenRemoveThem);
        }
        else {
            // TODO: Make BootstrapDialog able to hide immediately so that
            // this process of hiding one then showing another doesn't have
            // to be convoluted.
            if (this.getAllVocabsDialog) {
                this.getAllVocabsDialog.close();
                var removeAllStars = _.bind(this.removeAllStars, this);
                this.listenToOnce(this.getAllVocabsDialog, 'hidden', function() {
                    _.defer(removeAllStars);
                });
                this.getAllVocabsDialog = null;
            }
            else {
                this.removeAllStars();
            }

        }
    },
    /**
     * @method fetchItems
     * @param {string} [cursor]
     */
    fetchStarredVocabs: function(cursor) {
        this.starredVocabs.fetch({
            data: {
                sort: 'starred',
                limit: this.limit,
                cursor: cursor || ''
            },
            remove: false,
            sort: false
        });
    },
    /**
     * @method handleClickLoadMoreButton
     */
    handleClickLoadMoreButton: function() {
        this.fetchStarredVocabs(this.starredVocabs.cursor);
    },
    /**
     * @method handleClickStarLink
     * @param {Event} event
     */
    handleClickStarLink: function(event) {
        var vocabID = $(event.target).closest('tr').data('vocab-id');
        var vocab = this.starredVocabs.get(vocabID);
        vocab.toggleStarred();
        $(event.target)
            .toggleClass('glyphicon-star')
            .toggleClass('glyphicon-star-empty');
        vocab.save(
            {id: vocab.id, starred: vocab.get('starred')},
            {method: 'PUT', patch: true}
        );
    },
    /**
     * @method removeAllStars
     */
    removeAllStars: function() {
        this.beginVocabAction('remove-star', this.starredVocabs.clone());
        this.starredVocabs.reset();
        this.renderTable();
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
