define([], function() {
    /**
     * @class UserScheduler
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.data = [];
            this.review = null;
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            history: []
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(skritter.user.id + '-scheduler', JSON.stringify(this.toJSON()));
        },
        /**
         * @method calculateInterval
         * @param {Backbone.Model} item
         * @param {Number} score
         * @returns {Number}
         */
        calculateInterval: function(item, score) {
            var config = skritter.user.data.srsconfigs.get(item.get('part'));
            var newInterval;
            //return new items with randomized default config values
            if (!item.has('last')) {
                switch (score) {
                    case 1:
                        newInterval = config.get('initialWrongInterval');
                        break;
                    case 2:
                        newInterval = config.get('initialRightInterval') / 5;
                        break;
                    case 3:
                        newInterval = config.get('initialRightInterval');
                        break;
                    case 4:
                        newInterval = config.get('initialRightInterval') * 4;
                        break;
                }
                return this.randomizeInterval(newInterval);
            }
            //set values for further calculations
            var actualInterval = skritter.fn.getUnixTime() - item.get('last');
            var factor;
            var pctRight = item.get('successes') / item.get('reviews');
            var scheduledInterval = item.get('next') - item.get('last');
            //get the factor 
            if (score === 2) {
                factor = 0.9;
            } else if (score === 4) {
                factor = 3.5;
            } else {
                var factorsList = (score === 1) ? config.get('wrongFactors') : config.get('rightFactors');
                var divisions = [2, 1200, 18000, 691200];
                var index;
                for (var i in divisions) {
                    if (item.get('interval') > divisions[i]) {
                        index = i;
                    }
                }
                factor = factorsList[index];
            }
            //adjust the factor based on readiness
            if (score > 2) {
                factor -= 1;
                factor *= actualInterval / scheduledInterval;
                factor += 1;
            }
            //accelerate new items that appear to be known
            if (item.get('successes') === item.get('reviews') && item.get('reviews') < 5) {
                factor *= 1.5;
            }
            //decelerate hard items consistently marked wrong
            if (item.get('reviews') > 8) {
                if (pctRight < 0.5) {
                    factor *= Math.pow(pctRight, 0.7);
                }
            }
            //multiple by the factor and randomize the interval
            newInterval = this.randomizeInterval(item.get('interval') * factor);
            //bound the interval
            if (score === 1) {
                if (newInterval > 604800) {
                    newInterval = 604800;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            } else {
                if (newInterval > 315569260) {
                    newInterval = 315569260;
                } else if (score === 2 && newInterval < 300) {
                    newInterval = 300;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            }
            return newInterval;
        },
        /**
         * @method getDue
         * @param {Boolean} sort
         * @returns {Array}
         */
        getDue: function(sort) {
            if (sort) {
                this.sort();
            }
            return this.data.filter(function(item) {
                return item.readiness >= 1;
            });
        },
        /**
         * @method getDueCount
         * @param {Boolean} sort
         * @returns {Number}
         */
        getDueCount: function(sort) {
            return this.getDue(sort).length;
        },
        /**
         * @method getNext
         * @param {Function} callback
         */
        getNext: function(callback) {
            var data = this.data;
            var position = 0;
            var next = function() {
                var item = data[position];
                skritter.user.data.loadItem(item.id, function(item) {
                    if (item) {
                        callback(item);
                    } else {
                        position++;
                        next();
                    }
                });
            };
            if (data.length > 0) {
                next();
            } else {
                callback();
            }
        },
        /**
         * @method insert
         * @param {Array|Object} items
         */
        insert: function(items) {
            items = Array.isArray(items) ? items : [items];
            var itemsToRemove = [];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                var position = _.findIndex(this.data, {id: item.id});
                if (position === -1 && item.vocabIds.length !== 0) {
                    this.data.push({
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    });
                } else if (item.vocabIds.length !== 0) {
                    this.data[position] = {
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    };
                } else {
                    itemsToRemove.push(item.id);
                }
            }
            if (itemsToRemove.length > 0) {
                _.remove(this.data, function() {
                    return itemsToRemove.indexOf(item.id) !== -1;
                });
            }
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getSchedule(_.bind(function(schedule) {
                this.data = schedule;
                callback();
            }, this));
        },
        /**
         * @method sort
         * @returns {Array}
         */
        sort: function() {
            var activeParts = skritter.user.getActiveParts();
            var activeStyles = skritter.user.getActiveStyles();
            var history = this.get('history');
            var now = skritter.fn.getUnixTime();
            var randomizer = this.randomizeInterval;
            this.data = _.sortBy(this.data, function(item) {
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                //filter out inactive parts and styles
                if (activeParts.indexOf(item.part) === -1 ||
                        activeStyles.indexOf(item.style) === -1) {
                    item.readiness = 0;
                    return -item.readiness;
                }
                //deprioritize recently viewed items
                if (history.indexOf(item.id.split('-')[2]) !== -1) {
                    item.readiness = randomizer(0.2);
                    return -item.readiness;
                }
                //randomly prioritize new items
                if (item.last === 0) {
                    item.readiness = skritter.fn.randomDecimal(0.2, 0.5);
                    return -item.readiness;
                }
                //deprioritize overdue items
                if (readiness > 9999) {
                    item.readiness = randomizer(9999);
                    return -item.readiness;
                }
                item.readiness = readiness;
                return -item.readiness;
            });
            this.trigger('sorted', this.data);
            return this.data;
        },
        /**
         * @method randomizeInterval
         * @param {Number} interval
         * @returns {Number}
         */
        randomizeInterval: function(interval) {
            return Math.round(interval * (0.925 + (Math.random() * 0.15)));
        },
        /**
         * @method remove
         * @param {String} itemId
         * @returns {Object}
         */
        remove: function(itemId) {
            var position = _.findIndex(this.data, {id: itemId});
            if (position > -1) {
                return this.data.splice(position, 1);
            }
            return null;
        },
        /**
         * @method update
         * @param {Backbone.Model} item
         */
        update: function(item) {
            var history = this.get('history');
            var position = _.findIndex(this.data, {id: item.id});
            if (history.length >= 9) {
                history.unshift(item.id.split('-')[2]);
                history.pop();
            } else {
                history.unshift(item.id.split('-')[2]);
            }
            this.data[position] = {
                id: item.id,
                last: item.get('last'),
                next: item.get('next'),
                part: item.get('part'),
                style: item.get('style')
            };
        }
    });

    return Model;
});