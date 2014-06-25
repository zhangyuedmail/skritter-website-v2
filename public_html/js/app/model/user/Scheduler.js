define([], function() {
    /**
     * @class UserScheduler
     */
    var UserScheduler = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            UserScheduler.minIncrease = 10 * 60;
            UserScheduler.maxIncrease = 12 * 60 * 60;
            this.data = [];
            this.review = null;
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            history: [],
            spacedItems: []
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
         * @returns {Backbone.Model}
         */
        insert: function(items) {
            items = Array.isArray(items) ? items : [items];
            var spacedItems = this.get('spacedItems');
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                var position = _.findIndex(this.data, {id: item.id});
                //remove local spacing in favor of server data
                var spacingIndex = _.findIndex(spacedItems, {id: item.id});
                if (spacingIndex !== -1) {
                    spacedItems.splice(spacingIndex, 1);
                }
                //update or insert item into scheduler data
                if (position === -1 && item.vocabIds.length > 0) {
                    this.data.push({
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    });
                } else {
                    this.data[position] = {
                        id: item.id,
                        last: item.last ? item.last : 0,
                        next: item.next ? item.next : 0,
                        part: item.part,
                        style: item.style
                    };
                }
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getSchedule(_.bind(function(schedule) {
                this.data = schedule;
                this.sort();
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
            var spacedItems = this.get('spacedItems');
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
                    item.readiness = 0;
                    return -item.readiness;
                }
                //deprioritize items currently being spaced
                var spacedItemIndex = _.findIndex(spacedItems, {id: item.id});
                if (spacedItemIndex !== -1) {
                    var spacedItem = spacedItems[spacedItemIndex];
                    if (spacedItem.until > now) {
                        item.readiness = skritter.fn.randomDecimal(0.1, 0.3);
                        return -item.readiness;
                    } else {
                        spacedItems.splice(spacedItemIndex, 1);
                    }
                }
                //randomly deprioritize new spaced items
                if (!item.last && item.next - now > 600) {
                    item.readiness = skritter.fn.randomDecimal(0.1, 0.3);
                    return -item.readiness;
                }
                //randomly prioritize new items
                if (!item.last || item.next - item.last === 1) {
                    item.readiness = randomizer(9999);
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
         * @method spaceRelatedItems
         * @param {Backbone.Model} item
         */
        spaceRelatedItems: function(item) {
            var baseWriting = item.id.split('-')[2];
            var basePart = item.get('part');
            var now = skritter.fn.getUnixTime();
            var spacedItems = this.get('spacedItems');
            for (var i = 0, length = this.data.length; i < length; i++) {
                var dataItem = this.data[i];
                var dataRTD = dataItem.next - dataItem.last;
                var dataWriting = dataItem.id.split('-')[2];
                if (dataWriting === baseWriting && dataItem.part !== basePart) {
                    var spacedItem = _.find(spacedItems, {id: dataItem.id});
                    if (!spacedItem) {
                        var increase = dataItem.last === 0 ? UserScheduler.maxIncrease : dataRTD * 0.2;
                        var next = Math.round(now + Math.max(UserScheduler.minIncrease, increase));
                        if (next > UserScheduler.maxIncrease) {
                            next = UserScheduler.maxIncrease;
                        } else if (next < UserScheduler.minIncrease) {
                            next = UserScheduler.minIncrease;
                        }
                        spacedItems.push({id: dataItem.id, until: now + next});
                    }
                }
            }
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
         * @param {Boolean} space
         */
        update: function(item, space) {
            var history = this.get('history');
            var position = _.findIndex(this.data, {id: item.id});
            //add and pop item from recent history
            history.unshift(item.id.split('-')[2]);
            if (history.length >= 4) {
               history.pop();
            }
            //add related item spacing
            if (space) {
                this.spaceRelatedItems(item);
            }
            //update scheduler item directory
            this.data[position] = {
                id: item.id,
                last: item.get('last'),
                next: item.get('next'),
                part: item.get('part'),
                style: item.get('style')
            };
        }
    });

    return UserScheduler;
});