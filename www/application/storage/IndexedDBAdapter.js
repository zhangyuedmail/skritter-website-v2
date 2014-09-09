define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class IndexedDBAdapter
     * @extends BaseModel
     */
    var IndexedDBAdapter = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            database: undefined,
            databaseName: undefined,
            databaseVersion: 1
        },
        /**
         * @method clear
         * @param {Array|String} tables
         * @param {Function} callback
         */
        clear: function(tables, callback) {
            if (tables) {
                var transaction = this.get('database').transaction(tables, 'readwrite');
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
         * @method clearAll
         * @param {Function} callback
         */
        clearAll: function(callback) {
            var tables = [];
            for (var i = 0, length = this.get('database').objectStoreNames.length; i < length; i++) {
                tables.push(this.get('database').objectStoreNames[i]);
            }
            this.clear(tables, callback);
        },
        /**
         * @method destroy
         * @param {Function} callback
         */
        destroy: function(callback) {
            var self = this;
            if (this.isLoaded()) {
                this.get('database').close();
                var request = indexedDB.deleteDatabase(this.get('databaseName'));
                request.onsuccess = function() {
                    self.set({database: undefined, databaseName: undefined});
                    callback();
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
                var transaction = this.get('database').transaction(table, 'readonly');
                transaction.oncomplete = function () {
                    callback(data);
                };
                transaction.onerror = function (error) {
                    callback(undefined, error);
                };
                transaction.objectStore(table).openCursor().onsuccess = function (event) {
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
         * @method getItem
         * @param {String} table
         * @param {Array|String} ids
         * @param {Function} callback
         */
        getItems: function(table, ids, callback) {
            var items = [];
            if (table && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                var transaction = this.get('database').transaction(table, 'readonly');
                var objectStore = transaction.objectStore(table);
                var push = function(event) {
                    if (event.target.result) {
                        items.push(event.target.result);
                    }
                };
                transaction.oncomplete = function() {
                    callback(items);
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
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            var data = [];
            var transaction = this.get('database').transaction('items', 'readonly');
            transaction.oncomplete = function() {
                callback(data);
            };
            transaction.onerror = function(error) {
                callback(undefined, error);
            };
            transaction.objectStore('items').openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    data.push({
                        id: cursor.value.id,
                        part: cursor.value.part,
                        style: cursor.value.style,
                        next: cursor.value.next,
                        last: cursor.value.last,
                        reviews: cursor.value.reviews,
                        successes: cursor.value.successes
                    });
                    cursor.continue();
                }
            };
        },
        /**
         * @method isLoaded
         * @returns {Boolean}
         */
        isLoaded: function() {
            return this.get('database') ? true : false;
        },
        /**
         * @method open
         * @param {String} databaseName
         * @param {Function} callback
         */
        open: function(databaseName, callback) {
            var self = this;
            var request = indexedDB.open(databaseName, this.get('databaseVersion'));
            request.onsuccess = function(event) {
                self.set('database', event.target.result);
                self.set('databaseName', databaseName);
                callback();
            };
            request.onerror = function(error) {
                callback(error);
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
        },
        /**
         * @method putItems
         * @param {String} table
         * @param {Array|Object} items
         * @param {Function} callback
         */
        putItems: function(table, items, callback) {
            if (table && items) {
                var transaction = this.get('database').transaction(table, 'readwrite');
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
         * @method removeItems
         * @param {String} table
         * @param {Array|String} ids
         * @param {Function} callback
         */
        removeItems: function(table, ids, callback) {
            if (table && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                var transaction = this.get('database').transaction(table, 'readwrite');
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

    return IndexedDBAdapter;
});