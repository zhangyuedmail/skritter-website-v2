define([
    "framework/GelatoModel"
], function(GelatoModel) {
    return GelatoModel.extend({
        /**
         * @class IndexedDBAdapter
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.database = undefined;
            this.databaseName = undefined;
            this.databaseVersion = 1;
        },
        /**
         * @method clear
         * @param {Array|String} tables
         * @param {Function} callback
         */
        clear: function(tables, callback) {
            if (tables) {
                var transaction = this.database.transaction(tables, "readwrite");
                tables = Array.isArray(tables) ? tables : [tables];
                transaction.oncomplete = function() {
                    callback();
                };
                transaction.onerror = function(error) {
                    callback(error);
                };
                for (var i = 0, length = tables.length; i < length; i++) {
                    transaction.objectStore(tables[i]).clear();
                }
            } else {
                callback();
            }
        },
        /**
         * @method destroy
         * @param {Function} callback
         */
        destroy: function(callback) {
            var self = this;
            if (this.database) {
                this.database.close();
                var request = indexedDB.deleteDatabase(this.databaseName);
                request.onsuccess = function() {
                    self.database = undefined;
                    self.databaseName = undefined;
                    setTimeout(callback, 1000);
                };
                request.onerror = function(error) {
                    callback(error);
                };
            } else {
                callback();
            }
        },
        /**
         * @method getAll
         * @param {String} table
         * @param {Function} callback
         */
        getAll: function(table, callback) {
            var data = [];
            if (table) {
                var transaction = this.database.transaction(table, "readonly");
                transaction.oncomplete = function() {
                    callback(data);
                };
                transaction.onerror = function(error) {
                    callback(undefined, error);
                };
                transaction.objectStore(table).openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        data.push(cursor.value);
                        cursor.continue();
                    }
                };
            } else {
                callback(data);
            }
        },
        /**
         * @method open
         * @param {String} databaseName
         * @param {Function} callback
         */
        open: function(databaseName, callback) {
            var self = this;
            var request = indexedDB.open(databaseName, this.databaseVersion);
            request.onsuccess = function(event) {
                self.database = event.target.result;
                self.databaseName = databaseName;
                callback();
            };
            request.onerror = function(error) {
                callback(error);
            };
            request.onupgradeneeded = function(event) {
                var database = event.target.result;
                database.createObjectStore("decomps", {keyPath: "writing"});
                database.createObjectStore("items", {keyPath: "id"});
                database.createObjectStore("reviews", {keyPath: "id"});
                database.createObjectStore("sentences", {keyPath: "id"});
                database.createObjectStore("srsconfigs", {keyPath: "part"});
                database.createObjectStore("strokes", {keyPath: "rune"});
                database.createObjectStore("vocablists", {keyPath: "id"});
                database.createObjectStore("vocabs", {keyPath: "id"});
            };
        },
        /**
         * @method put
         * @param {String} table
         * @param {Array|Object} items
         * @param {Function} callback
         */
        put: function(table, items, callback) {
            if (table && items) {
                var transaction = this.database.transaction(table, "readwrite");
                var objectStore = transaction.objectStore(table);
                items = Array.isArray(items) ? items : [items];
                transaction.oncomplete = function () {
                    callback();
                };
                transaction.onerror = function (error) {
                    callback(error);
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
         * @param {String} table
         * @param {Array|String} ids
         * @param {Function} callback
         */
        remove: function(table, ids, callback) {
            if (table && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                var transaction = this.database.transaction(table, "readwrite");
                var objectStore = transaction.objectStore(table);
                transaction.oncomplete = function() {
                    callback();
                };
                transaction.onerror = function(error) {
                    callback(error);
                };
                for (var i = 0, length = ids.length; i < length; i++) {
                    objectStore.delete(ids[i]);
                }
            } else {
                callback();
            }
        }
    });
});
