const Dexie = require('dexie');
const GelatoModel = require('gelato/model');

/**
 * A model that represents a Skritter offline cache state.
 * @class OfflineModel
 * @extends {GelatoModel}
 */
const OfflineModel = GelatoModel.extend({

  /**
   * @method initialize
   * @param {Object} [attributes]
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(attributes, options) {
    options = _.defaults(options, {});

    this.database = null;
    this.status = 'standby';
    this.user = options.user;
  },

  /**
   * @property items
   * @type {Array}
   */
  items: [],

  /**
   * @property lists
   * @type {Array}
   */
  lists: [],

  /**
   * @property reviews
   * @type {Array}
   */
  reviews: [],

  /**
   * @property defaults
   * @type {Object}
   */
  defaults: function() {
    return {
      lastItemSync: 0,
      lastListSync: 0
    };
  },

  /**
   * Stores offline sync meta data to localStorage.
   */
  cache: function () {
    app.setLocalStorage(this.user.id + '-offline', this.toJSON());
  },

  /**
   * Gets next items based on specified query parameters.
   * @returns {Promise.<Object>}
   */
  loadNext: function (query) {
    query = _.defaults(query, {
      limit: 100,
      lists: [],
      parts: this.user.getFilteredParts(),
      styles: this.user.getFilteredStyles()
    });

    return new Promise(async resolve => {
      const result = {Characters: [], Items: [], Vocabs: []};

      const queryItemResult = await this.database.items.orderBy('next').limit(query.limit).filter(item => {
        // exclude when no active vocab ids
        if (!item.vocabIds || item.vocabIds.length === 0) {
          return false;
        }

        // exclude part not including in user settings
        if (!_.includes(query.parts, item.part)) {
          return false;
        }

        // exclude style not including in user settings
        if (!_.includes(query.styles, item.style)) {
          return false;
        }

        if (query.lists.length && _.intersection(query.lists, item.vocabListIds).length === 0) {
          return false;
        }

        return true;
      });

      // STEP 1: load items that are due next
      result.Items = await queryItemResult.toArray();

      // STEP 2: load vocabs based on items
      result.Vocabs = await this.loadVocabsFromItems(result.Items);

      // STEP 3: load more items based on vocabs
      console.log(_.chain(result.Vocabs).filter(vocab => vocab.containedVocabIds).map('containedVocabIds').flatten().uniq().value());

      // STEP 4: load characters based on vocabs

      resolve(result);
    });
  },

  /**
   * Loads vocabs based on item vocabIds property.
   * @returns {Promise.<Array>}
   */
  loadVocabsFromItems: async function (items) {
    const vocabIds = _.chain(items).map('vocabIds').flatten().uniq().value();
    const requests = _.map(vocabIds, vocabId => this.database.vocabs.get(vocabId));

    return Promise.all(requests);
  },

  /**
   * Loads characters based on vocab writing property.
   * @returns {Promise.<Array>}
   */
  loadCharactersFromVocabs: function (vocabs) {

  },

  /**
   * Loads all items from indexedDB.
   * @returns {Promise.<Array>}
   */
  loadAllItems: async function () {
    this.items = await this.database.items.toArray();

    return this.items;
  },

  /**
   * Loads all lists from indexedDB.
   * @returns {Promise.<Array>}
   */
  loadAllLists: async function () {
    this.lists = await this.database.lists.toArray();

    return this.lists;
  },

  /**
   * Loads all reviews from indexedDB.
   * @returns {Promise.<Array>}
   */
  loadAllReviews: async function () {
    this.reviews = await this.database.reviews.toArray();

    return this.reviews;
  },

   /**
   * Prepare offline sync meta data and indexedDB database.
   */
  prepare: function () {
    this.set(app.getLocalStorage(this.user.id + '-offline'));

    if (this.database) {
      this.database.close();
    }

    this.database = new Dexie('skritter:' + app.user.id);

    this.database.version(1).stores({
      characters: '_id,writing',
      items: 'id,next,part,style',
      lists: 'id,name,studyingMode',
      reviews: 'id',
      vocabs: 'id,writing'
    });
  },

  /**
   * Syncs data based on last sync time offsets.
   */
  sync: async function (offset) {
    this.status = 'syncing';

    this.trigger('status', this.status);

    let items = await this._downloadItems(offset);
    let vocabs = await this._downloadItemVocabs(items);
    let characters = await this._downloadVocabCharacters(vocabs);

    items = undefined;
    vocabs = undefined;
    characters = undefined;

    this.status = 'standby';

    this.trigger('status', this.status);
  },

  /**
   * Removes offline sync meta data from localStorage.
   */
  uncache: function () {
    this.status = 'uncaching';

    this.trigger('status', this.status);

    this.set(this.defaults());

    app.removeLocalStorage(this.user.id + '-offline');

    this.status = 'standby';

    this.trigger('status', this.status);
  },

  /**
   * Downloads all items based on changed offset.
   * @param {Number} [offset]
   * @returns {Promise.<Array>}
   * @private
   */
  _downloadItems: async function (offset) {
    const now = moment().unix();
    let items = [];
    let cursor;

    offset = offset || this.get('lastItemSync');

    return new Promise((resolve, reject) => {
      async.whilst(
        () => {
          return cursor !== null;
        },
        async callback => {
          try {
            const result = await this._fetchItems({sort: 'changed', offset, cursor });

            await this.database.items.bulkPut(result.data);

            items = items.concat(result.data);

            cursor = result.cursor;

            callback();
          } catch (error) {
            callback(error);
          }
        },
        error => {
          if (error) {
            reject(error);
          } else {
            this.set('lastItemSync', now);

            this.cache();

            resolve(items);
          }
        }
      );
    });
  },

  /**
   * Downloads all list marked as currently studying.
   * @returns {Promise.<Array>}
   * @private
   */
  _downloadLists: async function () {
    const now = moment().unix();
    const result = await this._fetchLists({sort: 'studying', fields: 'id'});

    return new Promise((resolve, reject) => {
      async.eachLimit(result.data, 5,
        async (list, callback) => {
          try {
            const result = await this._fetchList(list.id);

            await this.database.lists.put(result.data);

            callback();
          } catch (error) {
            callback(error);
          }
        },
        error => {
          if (error) {
            reject(error);
          } else {
            this.set('lastListSync', now);

            this.cache();

            resolve();
          }
        }
      );
    });
  },

  /**
   * Downloads vocabs based on array of items.
   * @param {Number} [offset]
   * @returns {Promise.<Array>}
   * @private
   */
  _downloadItemVocabs: async function (items) {
    const vocabIds = _.chain(items).map('vocabIds').flatten().uniq().value();
    const vocabIdChunks = _.chunk(vocabIds, 100);
    let vocabs = [];

    return new Promise((resolve, reject) => {
      async.eachLimit(vocabIdChunks, 10,
        async (chunk, callback) => {
          const result = await this._fetchVocabs({ids: chunk});

          if (result.data.length) {
            vocabs = vocabs.concat(result.data);
          }

          callback();
        },
        async error => {
          if (error) {
            reject(error);
          } else {
            await this.database.vocabs.bulkPut(vocabs);

            resolve(vocabs);
          }
        }
      );
    });
  },

  /**
   * Downloads characters based on array of vocabs.
   * @param {Array} vocabs
   * @returns {Promise.<Array>}
   * @private
   */
  _downloadVocabCharacters: async function (vocabs) {
    if (!vocabs ||! vocabs.length) {
      return Promise.resolve();
    }

    const writings = _.chain(vocabs).map('writing').join('').split('').uniq().value();

    const result = await this._fetchCharacters({ writings });

    return this.database.characters.bulkPut(result.data);
  },

  /**
   * Fetches characters from the server based on params.
   * @param {Object} [params]
   * @returns {Promise.<{data: [], cursor: null}>}
   * @private
   */
  _fetchCharacters: async function (params) {
    params = _.defaults(params, {
      lang: app.getLanguage()
    });

    if (params.writings && _.isArray(params.writings)) {
      params.writings = params.writings.join('');
    }

    const response = await $.ajax({
      url: app.getApiUrl(2) + 'characters',
      method: 'GET',
      headers: app.user.session.getHeaders(),
      data: params
    });

    return {data: response, cursor: null};
  },

  /**
   * Fetches items from the server based on params.
   * @param {Object} [params]
   * @returns {Promise.<{data: [], cursor: null}>}
   * @private
   */
  _fetchItems: async function (params) {
    params = _.defaults(params, {
      lang: app.getLanguage()
    });

    if (params.ids && _.isArray(params.ids)) {
      params.ids = params.ids.join('|');
    }

    const response = await $.ajax({
      url: app.getApiUrl() + 'items',
      method: 'GET',
      headers: app.user.session.getHeaders(),
      data: params
    });

    const responseCursor = response.cursor || null;
    const responseItems = response.Items.concat(response.ContainedItems || []);

    return {data: responseItems, cursor: responseCursor};
  },

  /**
   * Fetches a single list from server based on id.
   * @param {String} listId
   * @returns {Promise.<{data: {}, cursor: null}>}
   * @private
   */
  _fetchList: async function (listId) {
    const response = await $.ajax({
      url: app.getApiUrl() + 'vocablists/' + listId,
      method: 'GET',
      headers: app.user.session.getHeaders()
    });

    const responseCursor = response.cursor || null;
    const responseList = response.VocabList;

    return {data: responseList, cursor: responseCursor};
  },

  /**
   * Fetches vocablists from the server based on params.
   * @param {Object} [params]
   * @returns {Promise.<{data: [], cursor: null}>}
   * @private
   */
  _fetchLists: async function (params) {
    params = _.defaults(params, {
      lang: app.getLanguage()
    });

    if (params.ids && _.isArray(params.ids)) {
      params.ids = params.ids.join('|');
    }

    const response = await $.ajax({
      url: app.getApiUrl() + 'vocablists',
      method: 'GET',
      headers: app.user.session.getHeaders(),
      data: params
    });

    const responseCursor = response.cursor || null;
    const responseLists = response.VocabLists;

    return {data: responseLists, cursor: responseCursor};
  },

  /**
   * Fetches vocabs from the server based on params.
   * @param {Object} [params]
   * @returns {Promise.<{data: [], cursor: null}>}
   * @private
   */
  _fetchVocabs: async function (params) {
    params = _.defaults(params, {
      lang: app.getLanguage()
    });

    if (params.ids && _.isArray(params.ids)) {
      params.ids = params.ids.join('|');
    }

    const response = await $.ajax({
      url: app.getApiUrl() + 'vocabs',
      method: 'GET',
      headers: app.user.session.getHeaders(),
      data: params
    });

    const responseCursor = response.cursor || null;
    const responseVocabs = response.Vocabs || [];

    return {data: responseVocabs, cursor: responseCursor};
  }

});

module.exports = OfflineModel;
