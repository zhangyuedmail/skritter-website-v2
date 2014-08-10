/**
 * @module Application
 */
define([
    "framework/GelatoModel",
    "app/collections/data/Items",
    "app/collections/data/Vocabs"
], function(GelatoModel, DataItems, DataVocabs) {
    return GelatoModel.extend({
        /**
         * @class UserData
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {
            this.items = new DataItems();
            this.vocabs = new DataVocabs();
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
            app.dialog.show("download").element(".download-title").text("Requesting");
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
                        app.api.requestBatch({
                            path: "api/v" + app.api.get("version") + "/items",
                            method: "GET",
                            params: {
                                sort: "changed",
                                offset: 0,
                                include_vocabs: "true",
                                include_sentences: "false",
                                include_strokes: "true",
                                include_heisigs: "true",
                                include_top_mnemonics: "true",
                                include_decomps: "true"
                            },
                            spawner: true
                        }, function(result, status) {
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
                        console.log(status, result);
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
            ], function() {
                app.dialog.hide();
                if (typeof callback === "function") {
                    callback();
                }
            });
        },
        /**
         * @method getAll
         */
        getAll: function(callback) {
            var self = this;
            self.items.reset();
            self.vocabs.reset();
            async.series([
                function(callback) {
                    app.storage.getAll("items", function(items) {
                        self.items.add(items, {silent: true});
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll("vocabs", function(vocabs) {
                        self.vocabs.add(vocabs, {silent: true});
                        callback();
                    });
                }
            ], function() {
                console.log("getAll: complete");
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
