/**
 * @module Skritter
 * @submodule Storage
 * @param Database
 * @author Joshua McFarland
 */
define(function(Database) {
    /**
     * @class IndexedDBAdapter
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.database = null;
            this.name = null;
            this.version = 1;
        },
        /**
         * @method clear
         * @param {String} tableName
         * @param {Function} callback
         */
        clear: function(tableName, callback) {
            var transaction = this.database.transaction(tableName, 'readwrite');
            transaction.oncomplete = function() {
                if (typeof callback === 'function') {
                    callback();
                }
            };
            transaction.onerror = function(event) {
                console.error(event);
            };
            transaction.objectStore(tableName).clear();
        },
        /**
         * @method destroy
         * @param {Function} callback
         */
        destroy: function(callback) {
            this.database.close();
            var request = window.indexedDB.deleteDatabase(this.name);
            request.onsuccess = _.bind(function() {
                if (typeof callback === 'function') {
                    callback();
                }
            }, this);
            request.onerror = function(error) {
                console.error(error);
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
                var transaction = this.database.transaction(tableName, 'readonly');
                var objectStore = transaction.objectStore(tableName);
                transaction.oncomplete = function() {
                    callback(items);
                };
                var push = function(event) {
                    if (event.target.result) {
                        items.push(event.target.result);
                    }
                };
                transaction.onerror = function(event) {
                    console.error(event);
                };
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
            var transaction = this.database.transaction(tableName, 'readonly');
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
         * @method open
         * @param {String} name
         * @param {Function} callback
         */
        open: function(name, callback) {
            var tables = this.tables;
            var request = window.indexedDB.open(name, this.version);
            request.onerror = function(event) {
                console.error(event);
            };
            request.onupgradeneeded = function(event) {
                var database = event.target.result;
                database.createObjectStore('decomps', {keyPath: 'writing'});
                database.createObjectStore('items', {keyPath: 'id'});
                database.createObjectStore('reviews', {keyPath: 'id'});
                database.createObjectStore('sentences', {keyPath: 'id'});
                database.createObjectStore('srsconfigs', {keyPath: 'part'});
                database.createObjectStore('strokes', {keyPath: 'rune'});
                database.createObjectStore('vocablists', {keyPath: 'id'});
                database.createObjectStore('vocabs', {keyPath: 'id'});
            };
            request.onsuccess = _.bind(function() {
                this.database = request.result;
                this.name = name;
                callback();
            }, this);
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
                var transaction = this.database.transaction(tableName, 'readwrite');
                var objectStore = transaction.objectStore(tableName);
                transaction.oncomplete = function() {
                    callback();
                };
                transaction.onerror = function(event) {
                    console.error(event);
                };
                for (var i = 0, length = items.length; i < length; i++) {
                    objectStore.put(items[i]);
                }
            } else {
                callback();
            }
        },
        /**
         * @method remove
         * @param {String} tableName
         * @param {Array|String} ids
         * @param {Function} callback
         */
        remove: function(tableName, ids, callback) {
            if (tableName && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                var transaction = this.database.transaction(tableName, 'readwrite');
                var objectStore = transaction.objectStore(tableName);
                transaction.oncomplete = function() {
                    callback();
                };
                transaction.onerror = function(event) {
                    console.error(event);
                };
                for (var i = 0, length = ids.length; i < length; i++) {
                    objectStore.delete(ids[i]);
                }
            } else {
                callback();
            }
        }
    });

    return Model;
});