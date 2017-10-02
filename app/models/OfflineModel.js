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
  initialize: function (attributes, options) {
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
  defaults: function () {
    return {
      lastSync: 0
    };
  },

  /**
   * Stores offline sync meta data to localStorage.
   */
  cache: function () {
    app.setLocalStorage(this.user.id + '-offline', this.toJSON());
  },

  /**
   * Returns a boolean state regarding offline study readiness.
   * @returns {boolean}
   */
  isReady: function () {
    return app.config.offlineEnabled && !!this.get('lastSync');
  },

  /**
   * Gets next items based on specified query parameters.
   * @returns {Promise.<Object>}
   */
  loadNext: async function (query) {
    query = _.defaults(query, {
      limit: 100,
      lists: [],
      parts: this.user.getFilteredParts(),
      styles: this.user.getFilteredStyles()
    });

    return new Promise(async resolve => {
      const result = {Characters: [], ContainedItems: [], ContainedVocabs: [], Items: [], Vocabs: []};

      // STEP 1: Order and fetch items to be studied next
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

      // STEP 2: load items that are due next and remove related prompts
      result.Items = await queryItemResult.toArray();
      result.Items = _.uniqBy(result.Items, item =>  item.id.split('-')[2]);

      // STEP 3: load vocabs based on items
      result.Vocabs = await this.loadVocabsFromItems(result.Items);

      // STEP 4: load more items based on vocabs
      const containedVocabIds = _.chain(result.Vocabs).filter(vocab => vocab.containedVocabIds).map('containedVocabIds').flatten().uniq().value();
      const queryRelatedItemResult = await this.database.items.filter(item => _.some(containedVocabIds, vocabId => item.id.indexOf(vocabId) > -1));

      result.ContainedItems = await queryRelatedItemResult.toArray();

      // STEP 5: load characters based on vocabs
      result.Characters = await this.loadCharactersFromVocabs(result.Vocabs);

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
    const writings = _.chain(vocabs).map('writing').join('').split('').uniq().value();
    const requests = _.map(writings, writing => this.database.characters.where('writing').equals(writing).first());

    return Promise.all(requests);
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
   * Stores a review in the database and updates array.
   * @param {ReviewModel[]} reviews
   * @returns {Promise.<Array>}
   */
  putReviews: function (reviews) {
    reviews = _.isArray(reviews) ? reviews : [reviews];

    return new Promise(async (resolve, reject) => {
      const reviewData = [];

      for (let a = 0, lengthA = reviews.length; a < lengthA; a++) {
        const review = reviews[a];
        const reviewIndex = _.findIndex(this.reviews, {group: review.id});
        const reviewJSON = review.toJSON();
        const reviewCache = {};

        delete reviewJSON.promptItems;

        _.forEach(reviewJSON.data, data => delete data.item);

        if (reviewIndex) {
          this.reviews[reviewIndex] = reviewJSON;
        } else {
          this.reviews.push(reviewJSON);
        }

        reviewData.push(reviewJSON);
      }

      try {
        await this.database.reviews.bulkPut(reviewData);
      } catch (error) {
        reject(error);
      }

      resolve(reviews);
    });
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
      reviews: 'group,created',
      vocabs: 'id,writing'
    });
  },

  /**
   * Removes reviews by extracting the key from a review chunk.
   * @param {ReviewModel[]} reviews
   * @returns {Promise.<Array>}
   */
  removeReviews: function (reviews) {
    const reviewArray = _.isArray(reviews) ? reviews: [reviews];
    const groupIds = _.map(reviews, 'id');

    return this.database.reviews.bulkDelete(groupIds);
  },

  /**
   * Syncs data based on last sync time offsets.
   */
  sync: async function (offset) {
    const now = moment().unix();

    this.status = 'syncing';

    this.trigger('status', this.status);

    await this._downloadLists();

    let items = await this._downloadItems(offset);
    let vocabs = await this._downloadItemVocabs(items);
    let characters = await this._downloadVocabCharacters(vocabs);

    items = undefined;
    vocabs = undefined;
    characters = undefined;

    this.set('lastSync', now).cache();

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
   * Updates item and cache item values from reviews.
   * @param {ReviewModel[]} reviews
   * @returns {Promise.<Array>}
   */
  updateItems: function (reviews) {
    reviews = _.isArray(reviews) ? reviews : [reviews];

    return new Promise(async (resolve, reject) => {
      const reviewData = [];
      const updatedItems = [];

      for (let a = 0, lengthA = reviews.length; a < lengthA; a++) {
        const review = reviews[a];
        const reviewJSON = review.toJSON();

        for (let b = 0, lengthB = reviewJSON.data.length; b < lengthB; b++) {
          const reviewData = reviewJSON.data[b];
          const submitted = parseInt(reviewData.submitTime, 10);
          let item = _.find(updatedItems, {id: reviewData.itemId});

          if (!item) {
            item = await this.database.items.get(reviewData.itemId);
          }

          item.changed = submitted;
          item.interval = reviewData.newInterval;
          item.last = submitted;
          item.next = submitted + reviewData.newInterval;
          item.reviews += 1;
          item.successes += reviewData.score > 1 ? 1 : 0;

          updatedItems.push(item);
        }
      }

      try {
        await this.database.items.bulkPut(updatedItems);
      } catch (error) {
        reject(error);
      }

      resolve(updatedItems);
    });
  },

  /**
   * Downloads all items based on changed offset.
   * @param {Number} [offset]
   * @returns {Promise.<Array>}
   * @private
   */
  _downloadItems: async function (offset) {
    let items = [];
    let cursor;

    offset = offset || this.get('lastSync');

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
    const result = await this._fetchLists({sort: 'studying', fields: 'id'});
    let lists = [];

    return new Promise((resolve, reject) => {
      async.eachLimit(result.data, 5,
        async (list, callback) => {
          try {
            const result = await this._fetchList(list.id);

            await this.database.lists.put(result.data);

            lists = lists.concat(result.data);

            callback();
          } catch (error) {
            callback(error);
          }
        },
        error => {
          if (error) {
            reject(error);
          } else {
            resolve(lists);
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
    const writingChunks = _.chunk(writings, 100);
    let characters = [];

    return new Promise((resolve, reject) => {
      async.eachLimit(writingChunks, 10,
        async (chunk, callback) => {
          const result = await this._fetchCharacters({writings: chunk});

          if (result.data.length) {
            characters = characters.concat(result.data);
          }

          callback();
        },
        async error => {
          if (error) {
            reject(error);
          } else {
            await this.database.characters.bulkPut(characters);

            resolve(characters);
          }
        }
      );
    });
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
