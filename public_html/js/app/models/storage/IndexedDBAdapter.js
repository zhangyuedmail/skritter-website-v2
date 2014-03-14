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
            IndexedDBAdapter.version = 1;
        },
        /**
         * @method destroy
         * @param {Function} callback
         */
        destroy: function(callback) {
            IndexedDBAdapter.database.close();
            var request = window.indexedDB.deleteDatabase(IndexedDBAdapter.database.name);
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
                transaction.onerror = function(event) {
                    console.error(event);
                };
                var push = function(event) {
                    items.push(event.result.value);
                };
                var objectStore = transaction.objectStore(tableName);
                for (var i = 0, length = ids.length; i < length; i++) 
                    objectStore.get(ids[i]).onsuccess(push);
            } else {
                callback(items);
            }
        },
        /**
         * @method getAll
         * @param {String} tableName
         * @param {Function} callback
         * @param {Array} columns
         */
        getAll: function(tableName, callback, columns) {
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
                    if (columns) {
                        var value = {};
                        for (var i = 0, length = columns.length; i < length; i++)
                            value[columns[i]] = cursor.value[columns[i]] ? cursor.value[columns[i]] : undefined;
                        items.push(value);
                    } else {
                        items.push(cursor.value);
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
        }
    });
    
    return IndexedDBAdapter;
});