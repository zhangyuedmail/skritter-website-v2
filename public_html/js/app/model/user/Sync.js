define([
], function() {
    /**
     * @class UserSync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.syncing = false;
            this.on('change', _.bind(this.cache, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            addItemOffset: 0,
            lastItemSync: 0,
            lastSRSConfigSync: 0,
            lastVocabSync: 0
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(skritter.user.id + '-sync', JSON.stringify(this.toJSON()));
        },
        /**
         * @method start
         * @param {Function} callback
         * @param {Boolean} downloadAll
         */
        start: function(callback, downloadAll) {
            var self = this;
            if (self.syncing) {
                if (typeof callback === 'function')
                    callback();
                return;
            }
            var requests = [];
            var lastItemSync = downloadAll ? 0 : this.get('lastItemSync');
            var lastSRSConfigSync = downloadAll ? 0 : this.get('lastSRSConfigSync');
            var lastVocabSync = downloadAll ? 0 : this.get('lastVocabSync');
            if (lastItemSync === 0)
                skritter.modal.show('download')
                        .set('.modal-title', 'DOWNLOADING ACCOUNT')
                        .set('.modal-title-right', 'Getting Items')
                        .progress(100);
            requests.push({
                path: 'api/v' + skritter.api.get('version') + '/items',
                method: 'GET',
                params: {
                    sort: 'changed',
                    offset: lastItemSync,
                    include_vocabs: 'true',
                    include_strokes: 'true',
                    include_sentences: 'true',
                    include_heisigs: 'true',
                    include_top_mnemonics: 'true',
                    include_decomps: 'true'
                },
                spawner: true
            });
            if (lastVocabSync !== 0) {
                requests.push({
                    path: 'api/v' + skritter.api.get('version') + '/vocabs',
                    method: 'GET',
                    params: {
                        sort: 'all',
                        offset: lastVocabSync,
                        include_strokes: 'true',
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                });
            }
            if (lastSRSConfigSync === 0) {
                requests.push({
                    path: 'api/v' + skritter.api.get('version') + '/srsconfigs',
                    method: 'GET'
                });
            }
            skritter.api.getBatch(requests, _.bind(function(result) {
                skritter.user.data.insert(result);
                skritter.modal.hide();
            }, this), function(result) {
                console.log(result);
            });
        }
    });

    return Sync;
});