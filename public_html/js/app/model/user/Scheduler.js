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
            if (skritter.settings.get('webWorkers') && Modernizr.webworkers) {
                this.worker = new Worker('js/app/worker/SortSchedule.js');
                this.worker.addEventListener('message', _.bind(this.handleWorkerFinished, this), false);
            }
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            data: [],
            held: [],
            history: [],
            mergeInsert: [],
            mergeRemove: []
        },
        /**
         * @method addHeld
         * @param {Array|Object} items
         * @returns {UserScheduler}
         */
        addHeld: function(items) {
            items = Array.isArray(items) ? items : [items];
            var now = skritter.fn.getUnixTime();
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                var itemBaseWriting = item.id.split('-')[2];
                var heldItem = _.findIndex(this.get('held'), {baseWriting: itemBaseWriting});
                if (heldItem === -1) {
                    this.get('held').push({
                        baseWriting: itemBaseWriting,
                        until: now + 600
                    });
                }
            }
            return this;
        },
        /**
         * @method addHistory
         * @param {Array|Object} items
         * @returns {UserScheduler}
         */
        addHistory: function(items) {
            items = Array.isArray(items) ? items : [items];
            for (var i = 0, length = items.length; i < length; i++) {
                this.get('history').unshift(items[i].id.split('-')[2]);
                if (this.get('history').length > 5) {
                    this.get('history').pop();
                }
            }
            return this;
        },
        /**
         * @method cleanHeld
         * @returns {Array}
         */
        cleanHeld: function() {
            var now = skritter.fn.getUnixTime();
            return _.remove(this.get('held'), function(heldItem) {
                return heldItem.until < now;
            });
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
         * @param {Function} callback
         */
        getNext: function(callback) {
            var data = this.get('data');
            var history = this.get('history');
            var position = 0;
            if (data.length === 0) {
                return false;
            }
            function next() {
                var item = data[position];
                if (!item) {
                    item = data[0];
                }
                if (history.indexOf(item.id.split('-')[2]) !== -1) {
                    position++;
                    next();
                } else {
                    skritter.user.data.loadItem(item.id, function(item) {
                        if (item) {
                            callback(item);
                        } else {
                            position++;
                            next();
                        }
                    });
                }
            }
            next();
        },
        /**
         * @method handleWorkerFinished
         * @param {Object} event
         */
        handleWorkerFinished: function(event) {
            var data = event.data;
            this.attributes.data = data;
            this.set({mergeInsert: [], mergeRemove: []});
            this.cleanHeld();
            this.running = false;
            this.trigger('sorted');
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
            this.set('mergeInsert', this.get('mergeInsert').concat(items));
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
                this.sort(true);
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
        },
        /**
         * @method remove
         * @param {Array|Object} items
         * @returns {UserScheduler}
         */
        remove: function(items) {
            items = Array.isArray(items) ? items : [items];
            this.set('mergeRemove', this.get('mergeRemove').concat(items));
            return this;
        },
        /**
         * @method removeHeld
         * @param {Array|Object} items
         * @returns {UserScheduler}
         */
        removeHeld: function(items) {
            items = Array.isArray(items) ? items : [items];
            for (var i = 0, length = items.length; i < length; i++) {
                var heldPosition = _.findIndex(this.get('held'), {baseWriting: items[i].id.split('-')[2]});
                if (heldPosition !== -1) {
                    this.get('held').splice(heldPosition, 1);
                }
            }
            return this;
        },
        /**
         * @method sort
         * @param {Boolean} forceSync
         */
        sort: function(forceSync) {
            this.running = true;
            if (!forceSync && this.worker) {
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
                data: this.attributes.data,
                held: this.attributes.held,
                mergeInsert: JSON.stringify(this.attributes.mergeInsert),
                mergeRemove: JSON.stringify(this.attributes.mergeRemove)
            });
        },
        /**
         * @method sortSync
         */
        sortSync: function() {
            var activeParts = skritter.user.getActiveParts();
            var activeStyles = skritter.user.getActiveStyles();
            var data = this.get('data');
            var held = this.get('held');
            var item, itemPosition;
            var mergeInsert = this.get('mergeInsert');
            var mergeRemove = this.get('mergeRemove');
            var now = skritter.fn.getUnixTime();
            //merge inserts
            for (var a = 0, lengthA = mergeInsert.length; a < lengthA; a++) {
                item = mergeInsert[a];
                itemPosition = _.findIndex(data, {id: item.id});
                if (item.vocabIds.length === 0) {
                    continue;
                } else if (itemPosition === -1) {
                    data.push({
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    });
                } else {
                    data[itemPosition] = {
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    };
                }
            }
            //merge deletes
            for (var b = 0, lengthB = mergeRemove.length; b < lengthB; b++) {
                item = mergeRemove[b];
                itemPosition = _.findIndex(data, {id: item.id});
                if (itemPosition !== -1) {
                    data.splice(itemPosition, 1);
                }
            }
            //sort data
            data = _.sortBy(this.get('data'), function(item) {
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                //filter out inactive parts and styles
                if (activeParts.indexOf(item.part) === -1 ||
                    activeStyles.indexOf(item.style) === -1) {
                    item.readiness = 0;
                    return -item.readiness;
                }
                //filter out items currently being held
                if (_.findIndex(held, {baseWriting: item.id.split('-')[2]}) !== -1) {
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
            this.attributes.data = data;
            this.set({mergeInsert: [], mergeRemove: []});
            this.cleanHeld();
            this.trigger('sorted');
        },
        /**
         * @method update
         * @param {Array|Object} items
         * @returns {UserScheduler}
         */
        update: function(items) {
            this.addHeld(items);
            this.insert(items);
            return this;
        }
    });

    return UserScheduler;
});
