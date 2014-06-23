define([
    'model/data/Item'
], function(Item) {
    /**
     * @class DataItems
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('items', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method addItems
         * @param {Function} callback
         * @param {Number} limit
         */
        addItems: function(callback, limit) {
            var itemIds = [];
            var now = skritter.fn.getUnixTime();
            var offset = skritter.user.settings.get('addItemOffset');
            var requests = {
                path: 'api/v' + skritter.api.version + '/items/add',
                method: 'POST',
                params: {
                    lang: skritter.user.getLanguageCode(),
                    limit: limit ? limit : 1,
                    offset: offset,
                    fields: 'id'
                }
            };
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch, status) {
                        if (status === 200) {
                            callback(null, batch);
                        } else {
                            callback(batch);
                        }
                    });
                },
                function(batch, callback) {
                    function request() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                console.log(result);
                                if (result.Items) {
                                    itemIds = itemIds.concat(_.pluck(result.Items, 'id'));
                                }
                                window.setTimeout(request, 1000);
                            } else if (status === 200){
                                callback();
                            } else {
                                callback(result);
                            }
                        });
                    }
                    request();
                },
                function(callback) {
                    skritter.user.settings.set('addItemOffset', offset + itemIds.length);
                    skritter.user.data.items.fetch(function() {
                        callback();
                    }, now, true);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback(itemIds.length);
                }
            });
        },
        /**
         * @method fetch         
         * @param {Function} callback
         * @param {Number} offset
         * @param {Boolean} includeResources
         */
        fetch: function(callback, offset, includeResources) {
            skritter.user.sync.processBatch([
                {
                    path: 'api/v' + skritter.api.version + '/items',
                    method: 'GET',
                    params: {
                        lang: skritter.user.getLanguageCode(),
                        sort: 'changed',
                        offset: offset ? offset : 0,
                        include_vocabs: includeResources ? 'true' : undefined,
                        include_strokes: includeResources ? 'true' : undefined,
                        include_sentences: includeResources && skritter.user.isUsingSentences() ? 'true' : undefined,
                        include_heisigs: includeResources ? 'true' : undefined,
                        include_top_mnemonics: includeResources ? 'true' : undefined,
                        include_decomps: includeResources ? 'true' : undefined
                    },
                    spawner: true
                }
            ], function() {
                callback();
            });
        },
        /**
         * @method fetchById
         * @param {Array|String} itemIds
         * @param {Function} callback
         */
        fetchById: function(itemIds, callback) {
            skritter.api.getItems(itemIds, _.bind(function(items, status) {
                if (status === 200) {
                    this.insert(items, callback);
                    callback(null);
                } else {
                    callback(items);
                }
            }, this));
        },
        /**
         * @method insert
         * @param {Array|Object} items
         * @param {Function} callback
         */
        insert: function(items, callback) {
            skritter.storage.put('items', items, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('items', _.bind(function(items) {
                this.add(items, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        }
    });

    return Items;
});