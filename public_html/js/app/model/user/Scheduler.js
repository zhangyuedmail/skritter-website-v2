define([], function() {
    /**
     * @class UserScheduler
     */
    var UserScheduler = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.running = false;
            this.worker = null;
            if (Modernizr.webworkers) {
                this.worker = new Worker('js/app/worker/SortSchedule.js');
                this.worker.addEventListener('message', _.bind(this.handleWorkerFinished, this), false);
            }
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            data: [],
            history: [],
            inserts: []
        },
        /**
         * @method clear
         * @returns {UserScheduler}
         */
        clear: function() {
            this.set('data', []);
            return this;
        },
        /**
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            return this.get('data').filter(function(item) {
                return item.readiness >= 1.0;
            });
        },
        /**
         * @method getDueCount
         * @returns {Number}
         */
        getDueCount: function() {
            return this.getDue().length;
        },
        /**
         * @method getNext
         * @param {Function}callback
         */
        getNext: function(callback) {
            var data = this.get('data');
            var position = 0;
            function next() {
                var item = data[position];
                if (!item) {
                    return null;
                }
                skritter.user.data.loadItem(item.id, function(item) {
                    if (item) {
                        callback(item);
                    } else {
                        position++;
                        next();
                    }
                });
            }
            next();
        },
        /**
         * @method handleWorkerFinished
         * @param {Object} event
         */
        handleWorkerFinished: function(event) {
            var data = event.data;
            this.set('data', data);
            this.running = false;
            this.trigger('sorted', data);
            event.preventDefault();
        },
        /**
         * @method hasData
         * @returns {Boolean}
         */
        hasData: function() {
            return this.get('data').length > 0;
        },
        /**
         * @method update
         * @param {Array|Object} items
         * @returns {UserScheduler}
         */
        insert: function(items) {
            items = Array.isArray(items) ? items : [items];
            this.set('inserts', this.get('inserts').concat(items));
            return this;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getSchedule(_.bind(function(data) {
                this.set('data', data);
                this.trigger('loaded', data);
                this.sort();
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method mergeInserts
         */
        mergeInserts: function() {
            for (var i = 0, length = this.get('inserts').length; i < length; i++) {
                var item = this.get('inserts')[i];
                var itemPosition = _.findIndex(data, {id: item.id});
                if (item.vocabIds.length === 0) {
                    continue;
                } else if (itemPosition === -1) {
                    this.get('data').push({
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    });
                } else {
                    this.get('data')[itemPosition] = {
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    };
                }
            }
        },
        /**
         * @method remove
         * @param {Array|Object} items
         * @returns {UserScheduler}
         */
        remove: function(items) {
            items = Array.isArray(items) ? items : [items];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                var itemPosition = _.findIndex(this.get('data'), {id: item.id});
                this.get('data').splice(itemPosition, 1);
            }
            return this;
        },
        /**
         * @method sort
         */
        sort: function() {
            this.running = true;
            this.mergeInserts();
            if (this.worker) {
                this.sortAsync();
            } else {
                this.sortSync();
            }
        },
        /**
         * @method sortAsync
         */
        sortAsync: function() {
            this.worker.postMessage({
                activeParts: skritter.user.getActiveParts(),
                activeStyles: skritter.user.getActiveStyles(),
                data: this.get('data')
            });
        },
        /**
         * @method sortSync
         */
        sortSync: function() {
            var activeParts = skritter.user.getActiveParts();
            var activeStyles = skritter.user.getActiveStyles();
            var data = this.get('data').sort(function(item) {
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                //filter out inactive parts and styles
                if (activeParts.indexOf(item.part) === -1 ||
                    activeStyles.indexOf(item.style) === -1) {
                    item.readiness = 0;
                    return -item.readiness;
                }
                //randomly deprioritize new spaced items
                if (!item.last && item.next - now > 600) {
                    item.readiness = skritter.fn.randomDecimal(0.1, 0.3);
                    return -item.readiness;
                }
                //randomly prioritize new items
                if (!item.last || item.next - item.last === 1) {
                    item.readiness = skritter.fn.randomInterval(9999);
                    return -item.readiness;
                }
                //deprioritize overdue items
                if (readiness > 9999) {
                    item.readiness = skritter.fn.randomInterval(9999);
                    return -item.readiness;
                }
                item.readiness = readiness;
                return -item.readiness;
            });
            this.running = false;
            this.trigger('sorted', data);
        }
    });

    return UserScheduler;
});
