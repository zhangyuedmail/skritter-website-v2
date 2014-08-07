/**
 * @module Application
 */
define([
    "framework/GelatoModel"
], function(GelatoModel) {
    return GelatoModel.extend({
        /**
         * @class UserData
         * @extends GelatoModel
         * @constructor
         */
        initialize: function() {},
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(app.user.id + "-data", JSON.stringify(this.toJSON()));
        },
        /**
         * @method downloadAll
         * @param {Function} callback
         */
        downloadAll: function(callback) {
            async.series([
                function(callback) {
                    app.storage.clear([
                        "decomps",
                        "items",
                        "reviews",
                        "sentences",
                        "srsconfigs",
                        "strokes",
                        "vocablists",
                        "vocabs"
                    ], callback);
                },
                function(callback) {
                    app.user.api.getBatch({
                        path: "api/v" + app.user.api.get("version") + "/items",
                        method: "GET",
                        params: {
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
                    }, function(data) {
                        app.storage.put("items", data.Items, callback)
                    });
                }
            ], function() {
                console.log("download complete");
            });
        }
    });
});
