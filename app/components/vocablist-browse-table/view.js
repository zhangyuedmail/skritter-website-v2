var GelatoComponent = require('gelato/component');
var Vocablists = require('collections/vocablists');

/**
 * @class VocablistBrowseTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this._lists = [];
        this._filterString = '';
        this._filterType = [];
        this._layout = 'list';
        this._sortType = 'title';
        this.vocablists = new Vocablists();
        this.listenTo(this.vocablists, 'state', this.render);
        var data = {
            sort: 'official',
            lang: app.getLanguage()
        };
        this.vocablists.fetch({ data: data });
        this.listenTo(this.vocablists, 'sync', function() {
            if (this.vocablists.cursor) {
                data.cursor = this.vocablists.cursor;
                this.vocablists.fetch({ data: data, remove: false })
            }
        });
    },
    /**
     * @property events
     * @typeof {Object}
     */
    events: {
        'vclick #title-sort': 'handleClickTitleSort',
        'vclick #popularity-sort': 'handleClickPopularitySort',
        'vclick .add-to-queue-link': 'handleClickAddToQueueLink'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistTable}
     */
    render: function() {
        this.update();
        this.renderTemplate();
        this.$('#grid img').error(this.handleLoadImageError);
        this.delegateEvents();
        return this;
    },
    /**
     * @method handleClickTitleSort
     * @param {Event} event
     */
    handleClickTitleSort: function(event) {
        event.preventDefault();
        this._sortType = 'title';
        this.render();
    },
    /**
     * @method handleClickPopularitySort
     * @param {Event} event
     */
    handleClickPopularitySort: function(event) {
        event.preventDefault();
        this._sortType = 'popularity';
        this.render();
    },
    /**
     * @method handleClickAddToQueueLink
     * @param {Event} event
     */
    handleClickAddToQueueLink: function(event) {
        event.preventDefault();
        var listId = $(event.currentTarget).data('vocablist-id');
        var vocablist = this.vocablists.get(listId);
        if (vocablist.get('studyingMode') === 'not studying') {
            vocablist.save({'studyingMode': 'adding'}, {patch: true});
            this.render();
        }
    },
    /**
     * @method handleLoadImageError
     * @param {Event} event
     */
    handleLoadImageError: function(event) {
        $(event.target).remove();
    },
    /**
     * @method setFilterString
     * @param {String} value
     */
    setFilterString: function(value) {
        this._filterString = value.toLowerCase();
        this.render();
    },
    /**
     * @method setLayout
     * @param {String} value
     */
    setLayout: function(value) {
        this._layout = value.toLowerCase();
        this.render();
    },
    /**
     * @method update
     * @returns {VocablistBrowseTable}
     */
    update: function() {
        this._lists = this.vocablists.models;
        this.updateFilter();
        this.updateSort();
        return this;
    },
    /**
     * @method updateFilter
     */
    updateFilter: function() {
        this._lists = _.filter(this._lists, (function(vocablist) {
            if (this._filterString !== '') {
                var name = vocablist.get('name').toLowerCase();
                var shortName = vocablist.get('shortName').toLowerCase();
                if (_.contains(name, this._filterString)) {
                    return true;
                }
                if (_.contains(shortName, this._filterString)) {
                    return true;
                }
                return false
            }
            if (this._filterType.length) {
                //TODO: support checkbox filters
                return false;
            }
            return true;
        }).bind(this));
    },
    /**
     * @method updateSort
     */
    updateSort: function() {
        this._lists = _.sortBy(this._lists, (function(vocablist) {
            if (this._sortType === 'popularity') {
                return -vocablist.get('peopleStudying');
            }
            return vocablist.get('name');
        }).bind(this));
    }
});
