/**
 * @module Application
 */
define([
    "framework/GelatoModel",
    "app/collections/data/DataDecomps",
    "app/collections/data/DataItems",
    "app/collections/data/DataParams",
    "app/collections/data/DataStrokes",
    "app/collections/data/DataVocabs",
    "app/collections/data/DataVocabLists"
], function(GelatoModel, DataDecomps, DataItems, DataParams, DataStrokes, DataVocabs, DataVocabLists) {
    return GelatoModel.extend({
        /**
         * @class UserData
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.decomps = new DataDecomps();
            this.items = new DataItems();
            this.params = new DataParams().loadAll();
            this.strokes = new DataStrokes();
            this.vocabs = new DataVocabs();
            this.vocablists = new DataVocabLists();
            this.on("change", this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            "access_token": undefined,
            "batchId": undefined,
            "expires_in": undefined,
            "lastErrorCheck": 0,
            "lastItemSync": 0,
            "lastReviewSync": 0,
            "lastSRSConfigSync": 0,
            "lastVocabSync": 0,
            "refresh_token": undefined,
            "token_type": undefined,
            "user_id": "guest"
        },
        /**
         * @method cache
         */
        cache: function() {
            app.api.set("token", this.get("access_token"));
            localStorage.setItem(app.user.id + "-data", JSON.stringify(this.toJSON()));
        },
        /**
         * @method downloadAll
         * @param {Function} callback
         */
        downloadAll: function(callback) {
            var self = this;
            var now = moment().unix();
            app.dialog.show("download").element(".download-title").text("Requesting");
            self.set({
                "batchId": undefined,
                "lastErrorCheck": 0,
                "lastItemSync": 0,
                "lastReviewSync": 0,
                "lastSRSConfigSync": 0,
                "lastVocabSync": 0
            });
            async.series([
                function(callback) {
                    app.storage.destroy(callback);
                },
                function(callback) {
                    app.storage.open(app.user.id, callback);
                },
                function(callback) {
                    if (self.get("batchId")) {
                        callback();
                    } else {
                        app.api.requestBatch([
                            {
                                path: "api/v" + app.api.get("version") + "/items",
                                method: "GET",
                                params: {
                                    lang: app.user.getLanguageCode(),
                                    sort: "changed",
                                    offset: 0,
                                    include_vocabs: "true",
                                    include_sentences: "true",
                                    include_strokes: "true",
                                    include_heisigs: "true",
                                    include_top_mnemonics: "true",
                                    include_decomps: "true"
                                },
                                spawner: true
                            },
                            {
                                path: "api/v" + app.api.get("version") + "/srsconfigs",
                                method: "GET",
                                params: {
                                    lang: app.user.getLanguageCode()
                                }
                            },
                            {
                                path: "api/v" + app.api.get("version") + "/vocablists",
                                method: "GET",
                                params: {
                                    lang: app.user.getLanguageCode(),
                                    sort: "studying"
                                }
                            }
                        ], function(result, status) {
                            if (status === 200) {
                                self.set("batchId", result.id);
                                callback();
                            } else {
                                callback(result);
                            }
                        });
                    }
                },
                function(callback) {
                    app.api.getBatch(self.get("batchId"), function(result, status) {
                        if (status === "wait") {
                            app.dialog.element(".download-title").text("Assembling");
                            app.dialog.element(".download-status-text").text(app.fn.convertBytesToSize(result.responseSize));
                        } else {
                            var percent = Math.floor((result.downloadedRequests / result.totalRequests) * 100);
                            app.dialog.element(".download-title").text("Downloading");
                            app.dialog.element(".download-status-text").text(percent + "%");
                            app.dialog.progress(percent);
                            self.put(result);
                        }
                    }, function() {
                        callback();
                    });
                }
            ], function(error) {
                if (error) {
                    if (typeof callback === "function") {
                        callback(error);
                    }
                } else {
                    self.loadAll(function() {
                        self.set({
                            "batchId": undefined,
                            "lastErrorCheck": now,
                            "lastItemSync": now,
                            "lastReviewSync": now,
                            "lastSRSConfigSync": now,
                            "lastVocabSync": now
                        });
                        app.dialog.hide();
                    });
                }
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            async.series([
                function(callback) {
                    app.dialog.element(".message-text").text("items".toUpperCase());
                    app.storage.getAll("items", function(items) {
                        self.items.add(items);
                        self.trigger("load:items");
                        callback();
                    });
                },
                function(callback) {
                    app.dialog.element(".message-text").text("vocabs".toUpperCase());
                    app.storage.getAll("vocabs", function(vocabs) {
                        self.vocabs.add(vocabs);
                        self.trigger("load:vocabs");
                        callback();
                    });
                },
                function(callback) {
                    app.dialog.element(".message-text").text("strokes".toUpperCase());
                    app.storage.getAll("strokes", function(strokes) {
                        self.strokes.add(strokes);
                        self.trigger("load:strokes");
                        callback();
                    });
                },
                function(callback) {
                    app.dialog.element(".message-text").text("decomps".toUpperCase());
                    app.storage.getAll("decomps", function(decomps) {
                        self.decomps.add(decomps);
                        self.trigger("load:decomps");
                        callback();
                    });
                }
            ], function() {
                self.trigger("load");
                if (typeof callback === "function") {
                    callback();
                }
            });
        },
        /**
         * @method put
         * @param {Object} result
         * @param {Function} callback
         */
        put: function(result, callback) {
            async.series([
                function(callback) {
                    app.storage.put("decomps", result.Decomps, callback);
                },
                function(callback) {
                    app.storage.put("items", result.Items, callback);
                },
                function(callback) {
                    app.storage.put("sentences", result.Sentences, callback);
                },
                function(callback) {
                    app.storage.put("srsconfigs", result.SRSConfigs, callback);
                },
                function(callback) {
                    app.storage.put("strokes", result.Strokes, callback);
                },
                function(callback) {
                    app.storage.put("vocablists", result.VocabLists, callback);
                },
                function(callback) {
                    app.storage.put("vocabs", result.Vocabs, callback);
                }
            ], function() {
                if (typeof callback === "function") {
                    callback();
                }
            });
        }
    });
});
