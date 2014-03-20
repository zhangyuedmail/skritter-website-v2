/**
 * @module Skritter
 * @submodule Storage
 * @param Database
 * @author Joshua McFarland
 */
define([
    'models/storage/Database'
], function(Database) {
    /**
     * @class IndexedDBAdapter
     */
    var IndexedDBAdapter = Database.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            IndexedDBAdapter.database = null;
            IndexedDBAdapter.databaseName = null;
            IndexedDBAdapter.version = 1;
        },
        /**
         * @method destroy
         * @param {Function} callback
         */
        destroy: function(callback) {
            IndexedDBAdapter.database.close();
            var request = window.indexedDB.deleteDatabase(IndexedDBAdapter.databaseName);
            request.onsuccess = function() {
                callback();
            };
        },
        /**
         * @method get
         * @param {String} tableName
         * @param {Array|String} ids
         * @param {Function} callback
         */
        get: function(tableName, ids, callback) {
            var items = [];
            if (tableName && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                var transaction = IndexedDBAdapter.database.transaction(tableName, 'readonly');
                transaction.oncomplete = function() {
                    callback(items);
                };
                var push = function(event) {
                    if (event.target.result)
                        items.push(event.target.result);
                };
                transaction.onerror = function(event) {
                    console.error(event);
                };
                var objectStore = transaction.objectStore(tableName);
                for (var i = 0, length = ids.length; i < length; i++) {
                    var request = objectStore.get(ids[i]);
                    request.onsuccess = push;
                }
            } else {
                callback(items);
            }
        },
        /**
         * @method getAll
         * @param {String} tableName
         * @param {Function} callback
         */
        getAll: function(tableName, callback) {
            var items = [];
            var transaction = IndexedDBAdapter.database.transaction(tableName, 'readonly');
            transaction.oncomplete = function() {
                callback(items);
            };
            transaction.onerror = function(event) {
                console.error(event);
            };
            transaction.objectStore(tableName).openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    items.push(cursor.value);
                    cursor.continue();
                }
            };
        },
        /**
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            var schedule = [];
            var transaction = IndexedDBAdapter.database.transaction('items', 'readonly');
            transaction.oncomplete = function() {
                callback(schedule);
            };
            transaction.onerror = function(event) {
                console.error(event);
            };
            transaction.objectStore('items').openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.vocabIds.length > 0) {
                        var scheduleItem = {
                            id: cursor.value.id,
                            last: cursor.value.last ? cursor.value.last : 0,
                            next: cursor.value.next ? cursor.value.next : 0
                        };
                        if (cursor.value.held)
                            scheduleItem.held = cursor.value.held;
                        schedule.push(scheduleItem);
                    }
                    cursor.continue();
                }
            };
        },
        /**
         * @method open
         * @param {String} databaseName
         * @param {Function} callback
         */
        open: function(databaseName, callback) {
            var tables = this.tables;
            var request = window.indexedDB.open(databaseName, IndexedDBAdapter.version);
            request.onerror = function(event) {
                console.error(event);
            };
            request.onupgradeneeded = function(event) {
                var database = event.target.result;
                database.createObjectStore('decomps', {keyPath: tables.decomps.keys[0]});
                database.createObjectStore('items', {keyPath: tables.items.keys[0]});
                database.createObjectStore('reviews', {keyPath: tables.reviews.keys[0]});
                database.createObjectStore('sentences', {keyPath: tables.sentences.keys[0]});
                database.createObjectStore('strokes', {keyPath: tables.strokes.keys[0]});
                database.createObjectStore('srsconfigs', {keyPath: tables.srsconfigs.keys[0]});
                database.createObjectStore('vocablists', {keyPath: tables.vocablists.keys[0]});
                database.createObjectStore('vocabs', {keyPath: tables.vocabs.keys[0]});
            };
            request.onsuccess = function() {
                IndexedDBAdapter.database = request.result;
                IndexedDBAdapter.databaseName = databaseName;
                callback();
            };
        },
        /**
         * @method put
         * @param {String} tableName
         * @param {Array|Object} items
         * @param {Function} callback
         */
        put: function(tableName, items, callback) {
            if (tableName && items) {
                items = Array.isArray(items) ? items : [items];
                var transaction = IndexedDBAdapter.database.transaction(tableName, 'readwrite');
                transaction.oncomplete = function() {
                    callback();
                };
                transaction.onerror = function(event) {
                    console.error(event);
                };
                var objectStore = transaction.objectStore(tableName);
                for (var i = 0, length = items.length; i < length; i++)
                    objectStore.put(items[i]);
            } else {
                callback();
            }
        },
        /**
         * @method update
         * @param {String} tableName
         * @param {Array|Object} items
         * @param {Function} callback
         */
        update: function(tableName, items, callback) {
            items = Array.isArray(items) ? items : [items];
            this.get(tableName, _.pluck(items, 'id'), _.bind(function(originalItems) {
                var key = this.tables[tableName].keys[0];
                var updatedItems = [];
                for (var i = 0, length = items.length; i < length; i++)
                    updatedItems.push(_.assign(_.find(originalItems, {id: items[i][key]}), items[i]));
                this.put(tableName, updatedItems, function() {
                    if (typeof callback === 'function')
                        callback();
                });
            }, this));
        }
    });
    
    return IndexedDBAdapter;
});