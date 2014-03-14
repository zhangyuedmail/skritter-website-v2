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
     * @class WebSQLAdapter
     */
    var WebSQLAdapter = Database.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            WebSQLAdapter.database = null;
            WebSQLAdapter.version = '1.0';
            WebSQLAdapter.size = 50 * 1024 * 1024;
        },
        /**
         * @method destroy
         * @param {Function} callback
         */
        destroy: function(callback) {
            var tables = this.tables;
            var onError = function(event) {
                console.error(event);
            };
            var onSuccess = function() {
                callback();
            };
            WebSQLAdapter.database.transaction(function(tx) {
                for (var name in tables)
                    tx.executeSql('DROP TABLE IF EXISTS ' + name);
            }, onError, onSuccess);
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
                ids = ids.map(function(id) {
                    return JSON.stringify(id);
                });
                var valueString = this.valueString(ids);
                var key = this.tables[tableName].keys[0];
                var error = function(event) {
                    console.error(event);
                };
                var success = function() {
                    callback(items);
                };
                WebSQLAdapter.database.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM ' + tableName + ' WHERE ' + key + ' IN (' + valueString + ')', ids, results);
                    function results(tx, result) {
                        for (var a = 0, lengthA = result.rows.length; a < lengthA; a++) {
                            var item = _.cloneDeep(result.rows.item(a));
                            for (var b = 0, keys = Object.keys(item), lengthB = keys.length; b < lengthB; ++b)
                                item[keys[b]] = JSON.parse(item[keys[b]]);
                            items.push(item);
                        }
                    }
                }, error, success);
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
            var onError = function(event) {
                console.error(event);
            };
            var onSuccess = function() {
                callback(items);
            };
            WebSQLAdapter.database.transaction(function(tx) {
                tx.executeSql('SELECT * FROM ' + tableName, [], results);
                function results(tx, result) {
                    for (var a = 0, lengthA = result.rows.length; a < lengthA; a++) {
                        var item = _.cloneDeep(result.rows.item(a));
                        for (var b = 0, keys = Object.keys(item), lengthB = keys.length; b < lengthB; ++b)
                            item[keys[b]] = JSON.parse(item[keys[b]]);
                        items.push(item);
                    }
                }
            }, onError, onSuccess);
        },
        /**
         * @method open
         * @param {String} databaseName
         * @param {Function} callback
         */
        open: function(databaseName, callback) {
            var tables = this.tables;
            var onError = function(event) {
                console.error(event);
            };
            var onSuccess = function() {
                callback();
            };
            WebSQLAdapter.database = window.openDatabase(databaseName, WebSQLAdapter.version, databaseName, WebSQLAdapter.size);
            WebSQLAdapter.database.transaction(function(tx) {
                for (var name in tables) {
                    var table = tables[name];
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + name + ' (' + table.keys[0] + ' PRIMARY KEY,' + table.columns.join(',') + ')');
                }
            }, onError, onSuccess);
        },
        /**
         * @method put
         * @param {String} tableName
         * @param {Array|Object} items
         * @param {Function} callback
         */
        put: function(tableName, items, callback) {
            if (tableName && items) {
                var table = this.tables[tableName];
                var keysColumns = table.keys.concat(table.columns);
                var valueString = this.valueString(keysColumns);
                var onError = function(event) {
                    console.error(event);
                };
                var onSuccess = function() {
                    callback();
                };
                WebSQLAdapter.database.transaction(function(tx) {
                    var queryString = 'INSERT OR REPLACE INTO ' + tableName + ' (' + keysColumns.join(',') + ') VALUES (' + valueString + ')';
                    for (var a = 0, lengthA = items.length; a < lengthA; a++) {
                        var item = items[a];
                        var values = [];
                        for (var b = 0, lengthB = keysColumns.length; b < lengthB; b++) {
                            var value = item[keysColumns[b]];
                            if (typeof value === 'undefined') {
                                values.push('null');
                            } else {
                                values.push(JSON.stringify(value));
                            }
                        }
                        tx.executeSql(queryString, values);
                    }
                }, onError, onSuccess);
            } else {
                callback();
            }
        }
    });
    
    return WebSQLAdapter;
});