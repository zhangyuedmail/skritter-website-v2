const GelatoComponent = require('gelato/component');
const Vocablists = require('collections/VocablistCollection');

/**
 * @class VocablistsBrowseTableComponent
 * @extends {GelatoComponent}
 */
const VocablistsBrowseTableComponent = GelatoComponent.extend({

  /**
   * @property events
   * @typeof {Object}
   */
  events: {
    'click #title-sort': 'handleClickTitleSort',
    'click #popularity-sort': 'handleClickPopularitySort',
    'click .add-to-queue-link': 'handleClickAddToQueueLink',
    'error #grid img': 'handleLoadImageError',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsBrowseTable.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this._lists = [];
    this._filterString = app.get('lastVocablistBrowseSearch');
    this._filterType = [];
    this._layout = 'list';
    this._sortType = 'popularity';
    this.vocablists = new Vocablists();

    /**
     * Stores state of whether a list is currently being added
     * @type {boolean}
     * @private
     */
    this._adding = false;

    this.fetchOfficialLists();

    this.listenTo(this.vocablists, 'state', this.render);
    this.listenTo(this.vocablists, 'sync', function(collection, response, options) {
      if (options.data && options.data.sort === 'official' && response.cursor) {
        // TODO: figure out why this goes into an infinite loop
        // this.fetchLists({data: {cursor: response.cursor, sort: 'official'}});
      } else {
        this.trigger('component:loaded', 'table');
      }
    });
  },

  /**
   * Fetches a batch of vocab lists
   * @method fetchLists
   * @param {Object} [params] parameters to use in the request
   * @param {Object} [options] options to send to the fetch function
   */
  fetchLists: function(params, options) {
    const data = _.defaults(params, {
      lang: app.getLanguage(),
      languageCode: app.getLanguage(),
      sort: 'official',
    });

    options = _.defaults({data, remove: false}, options || {});
    return this.vocablists.fetch(options);
  },

  /**
   * @param {String} [state] the state change that caused the rerender,
   * if this was called through an event
   * @method render
   * @returns {VocablistsBrowseTableComponent}
   */
  render: function(state) {
    if (state === 'saving') {
      return;
    }

    this.update();
    this.renderTemplate();
    this.delegateEvents();
    return this;
  },

  /**
   * Fetches all the official textbook lists in batches.
   * @returns {Promise} resolves when all the lists have been fetched
   */
  fetchOfficialLists: function() {
    return new Promise((resolve, reject) => {
      this.fetchLists({sort: 'official'}, {success: (collection, resp) => {
        this.fetchLists({sort: 'official', cursor: resp.cursor}, {success: () => {
resolve();
}, error: reject});
      }, error: reject});
    });
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
    const target = $(event.currentTarget);
    const listId = target.data('vocablist-id');
    const vocablist = this.vocablists.get(listId);

    event.preventDefault();

    if (vocablist.get('studyingMode') === 'not studying' && !this._adding) {
      this._adding = true;
      vocablist.justAdded = true;
      target.removeClass('add-to-queue-link');
      target.find('.glyphicon-plus-sign').hide();
      target.find('.add-to-queue-text').text(app.locale('pages.vocabLists.adding'));

      vocablist.save({'studyingMode': 'adding'}, {
        patch: true,
        success: () => {
          if (app.getSetting('newuser-' + app.user.id)) {
            app.getSetting('newuser-' + app.user.id, false);
            app.router.navigateStudy();
          } else {
            this._adding = false;

            this.render();
          }
        },
        error: () => {
          this._adding = false;

          this.render();

          app.notifyUser({
            message: app.locale('pages.vocabLists.errorAddingList'),
          });
        },
      });
    }
  },

  /**
   * @method handleLoadImageError
   * @param {Event} event
   */
  handleLoadImageError: function(event) {
    this.$(event.target).remove();
  },

  /**
   * @method setFilterString
   * @param {String} value
   */
  setFilterString: function(value) {
    const searchValue = value.toLowerCase();

    app.set('lastVocablistBrowseSearch', searchValue);

    this._filterString = searchValue;

    this.render();
  },

  /**
   * @method setFilterString
   * @param {String} value
   */
  setFilterType: function(value) {
    const searchType = value.toLowerCase();

    app.set('lastVocablistBrowseOption', searchType);

    this._filterType = searchType;

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
   * @returns {VocablistsBrowseTableComponent}
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
    this._lists = _.filter(this._lists, (vocablist) => {
      if (this._filterType !== 'published' && this._filterString !== '') {
        const name = vocablist.get('name') && vocablist.get('name').toLowerCase();
        const shortName = vocablist.get('shortName') && vocablist.get('shortName').toLowerCase();

        if (_.includes(name, this._filterString)) {
          return true;
        }

        if (_.includes(shortName, this._filterString)) {
          return true;
        }

        return false;
      }

      return true;
    });
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
  },

});

module.exports = VocablistsBrowseTableComponent;
