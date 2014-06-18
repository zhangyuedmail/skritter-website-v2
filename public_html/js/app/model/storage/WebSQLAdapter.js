define([], function() {
    /**
     * @class WebSQLAdapter
     */
    var WebSQLAdapter = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.database = null;
            this.version = '1.0';
            this.size = 50 * 1024 * 1024;
        },
        /**
         * @property {Object} tables
         */
        tables: {
            decomps: {
                keys: ['writing'],
                columns: ['atomic', 'Children']
            },
            items: {
                keys: ['id'],
                columns: ['lang', 'part', 'vocabIds', 'style', 'timeStudied', 'next', 'last', 'interval', 'vocabListIds', 'sectionIds', 'reviews', 'successes', 'created', 'changed', 'previousSuccess', 'previousInterval', 'held']
            },
            reviews: {
                keys: ['id'],
                columns: ['originalItems', 'position', 'reviews']
            },
            sentences: {
                keys: ['id'],
                columns: ['containedVocabIds', 'definitions', 'lang', 'reading', 'starred', 'style', 'toughness', 'toughnessString', 'writing']
            },
            srsconfigs: {
                keys: ['part'],
                columns: ['lang', 'initialRightInterval', 'initialWrongInterval', 'rightFactors', 'wrongFactors']
            },
            strokes: {
                keys: ['rune'],
                columns: ['lang', 'strokes']
            },
            vocabs: {
                keys: ['id'],
                columns: ['writing', 'reading', 'definitions', 'customDefinitions', 'lang', 'audio', 'rareKanji', 'toughness', 'toughnessString', 'mnemonic', 'starred', 'style', 'changed', 'bannedParts', 'containedVocabIds', 'heisigDefinition', 'sentenceId', 'topMnemonic']
                
            },
            vocablists: {
                keys: ['id'],
                columns: ['name', 'lang', 'shortName', 'description', 'categories', 'creator', 'changed', 'published', 'deleted', 'parent', 'sort', 'singleSect', 'tags', 'editors', 'public', 'peopleStudying', 'studyingMode', 'currentSection', 'currentIndex', 'sectionsSkipping', 'autoSectionMovement', 'sections']
            }
        },
        /**
         * @method valueString
         * @param {Array} fieldArray
         * @returns {String}
         */
        valueString: function(fieldArray) {
            var valueString = '';
            for (var i = 1, length = fieldArray.length; i <= length; i++) {
                valueString += i === fieldArray.length ? '?' : '?,';
            }
            return valueString;
        },
        /**
         * @method clear
         * @param {String} tableName
         * @param {Function} callback
         */
        clear: function(tableName, callback) {
            var onError = function(event) {
                console.error(event);
            };
            var onSuccess = function() {
                if (typeof callback === 'function') {
                    callback();
                }
            };
            this.database.transaction(function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS ' + tableName);    
            }, onError, onSuccess);
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
                if (typeof callback === 'function') {
                    callback();
                }
            };
            this.database.transaction(function(tx) {
                for (var name in tables) {
                    tx.executeSql('DROP TABLE IF EXISTS ' + name);
                }
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
                ids = Array.isArray(ids) ? ids : [ids];
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
                this.database.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM ' + tableName + ' WHERE ' + key + ' IN (' + valueString + ')', ids, results);
                    function results(tx, result) {
                        for (var a = 0, lengthA = result.rows.length; a < lengthA; a++) {
                            var item = _.cloneDeep(result.rows.item(a));
                            for (var b = 0, keys = Object.keys(item), lengthB = keys.length; b < lengthB; ++b) {
                                item[keys[b]] = JSON.parse(item[keys[b]]);
                            }
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
            this.database.transaction(function(tx) {
                tx.executeSql('SELECT * FROM ' + tableName, [], results);
                function results(tx, result) {
                    for (var a = 0, lengthA = result.rows.length; a < lengthA; a++) {
                        var item = _.cloneDeep(result.rows.item(a));
                        for (var b = 0, keys = Object.keys(item), lengthB = keys.length; b < lengthB; ++b) {
                            var value = JSON.parse(item[keys[b]]);
                            if (value) {
                                item[keys[b]] = value;
                            } else {
                                delete item[keys[b]];
                            }
                        }
                        items.push(item);
                    }
                }
            }, onError, onSuccess);
        },
        /**
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            var schedule = [];
            var onError = function(event) {
                console.error(event);
            };
            var onSuccess = function() {
                callback(schedule);
            };
            this.database.transaction(function(tx) {
                tx.executeSql('SELECT id, lang, last, next, part, style, vocabIds FROM items', [], results);
                function results(tx, result) {
                    for (var a = 0, lengthA = result.rows.length; a < lengthA; a++) {
                        var item = _.cloneDeep(result.rows.item(a));
                        var id = JSON.parse(item.id);
                        var lang = JSON.parse(item.lang);
                        var last = JSON.parse(item.last);
                        var next = JSON.parse(item.next);
                        var part = JSON.parse(item.part);
                        var style = JSON.parse(item.style);
                        var vocabIds = JSON.parse(item.vocabIds);
                        if (vocabIds.length > 0 ||
                                (lang === 'ja' && !skritter.fn.isKana(id.split('-')[2]))) {
                            schedule.push({
                                id: id,
                                last: last ? last : 0,
                                next: next ? next : 0,
                                part: part,
                                style: style
                            });
                        }
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
            this.database = window.openDatabase(databaseName, this.version, databaseName, this.size);
            this.database.transaction(function(tx) {
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
                items = Array.isArray(items) ? items : [items];
                var table = this.tables[tableName];
                var keysColumns = table.keys.concat(table.columns);
                var valueString = this.valueString(keysColumns);
                var onError = function(event) {
                    console.error(event);
                };
                var onSuccess = function() {
                    callback();
                };
                this.database.transaction(function(tx) {
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
        },
        /**
         * @method remove
         * @param {String} tableName
         * @param {Array|String} ids
         * @param {Function} callback
         */
        remove: function(tableName, ids, callback) {
            var items = [];
            if (tableName && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                ids = ids.map(function(id) {
                    return JSON.stringify(id);
                });
                var key = this.tables[tableName].keys[0];
                var error = function(event) {
                    console.error(event);
                };
                var success = function() {
                    callback(items);
                };
                this.database.transaction(function(tx) {
                    for (var i = 0, length = ids.length; i < length; i++) {
                        tx.executeSql('DELETE FROM ' + tableName + ' WHERE ' + key + ' = ?', [ids[i]]);
                    }
                }, error, success);
            } else {
                callback(items);
            }
        }
    });

    return WebSQLAdapter;
});