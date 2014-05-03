define(function() {
    /**
     * @class Schedule
     */
    var Schedule = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.data = [];
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            held: {},
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
                for (var i in divisions)
                    if (item.get('interval') > divisions[i])
                        index = i;
                factor = factorsList[index];
            }
            //adjust the factor based on readiness
            if (score > 2) {
                factor -= 1;
                factor *= actualInterval / scheduledInterval;
                factor += 1;
            }
            //accelerate new items that appear to be known
            if (item.get('successes') === item.get('reviews') && item.get('reviews') < 5)
                factor *= 1.5;
            //decelerate hard items consistently marked wrong
            if (item.get('reviews') > 8)
                if (pctRight < 0.5)
                    factor *= Math.pow(pctRight, 0.7);
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
            if (sort)
                return this.sort().filter(function(item) {
                    return !item.held && item.readiness >= 1;
                });
            return this.data.filter(function(item) {
                return !item.held && item.readiness >= 1;
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
         * @method getItemBaseWriting
         * @param {String} itemId
         * @returns {String}
         */
        getItemBaseWriting: function(itemId) {
            return itemId.split('-')[2];
        },
        /**
         * @method getNext
         * @param {Function} callback
         */
        getNext: function(callback) {
            var position = 0;
            function next() {
                var item = skritter.user.scheduler.data[position];
                skritter.user.data.items.loadItem(item.id, function(item) {
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
         * @method insert
         * @param {Array|Object} items
         */
        insert: function(items) {
            items = Array.isArray(items) ? items : [items];
            var removeIds = [];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                var position = _.findIndex(this.data, {id: item.id});
                if (position > -1 && item.vocabIds.length === 0) {
                    removeIds.push(item.id);
                } else if (position > -1) {
                    this.data[position] = {
                        id: item.id,
                        last: item.last,
                        next: item.next,
                        vocabIds: item.vocabIds
                    };
                } else if (item.vocabIds.length === 0) {
                    this.data.push({
                        id: item.id,
                        last: item.last,
                        next: item.next,
                        vocabIds: item.vocabIds
                    });
                }
            }
            if (removeIds.length > 0) {
                this.data.filter(function(item) {
                    return removeIds.indexOf(item.id) === -1;
                });
            }
        },
        /**
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            var parts = skritter.user.settings.getActiveParts();
            var style = skritter.user.settings.getStyle();
            skritter.storage.getSchedule(parts, style, _.bind(function(schedule) {
                this.data = schedule;
                this.trigger('schedule:loaded');
                callback();
            }, this));
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
         * @method sort
         * @returns {Array}
         */
        sort: function() {
            var now = skritter.fn.getUnixTime();
            var held = this.get('held');
            var history = this.get('history');
            var historyCheck = this.data.length > 24 ? true : false;
            this.data = _.sortBy(this.data, _.bind(function(item) {
                var heldUntil = held[item.id];
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                
                //temporarily ban recent items
                if (historyCheck && history.indexOf(item.id.split('-')[2]) !== -1) {
                    item.readiness = 0;
                    return -item.readiness;
                }
                //randomly prioritize new items
                if (!heldUntil && !item.last) {
                    item.readiness = this.randomizeInterval(9999);
                    return -item.readiness;
                }
                //deprioritize held ready items
                if (heldUntil && heldUntil > now) {
                    if (readiness > 0.2) {
                        item.readiness = 0.2;
                        return -item.readiness;
                    }
                } else if (heldUntil) {
                    delete held[item.id];
                }
                //tweak old item readiness
                if (readiness > 0 && seenAgo > 9000) {
                    var dayBonus = 1;
                    var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * skritter.fn.daysInSecond);
                    var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                    ageBonus *= readiness2 * readiness2;
                    readiness += ageBonus;
                }
                //mix overdue items in with new items
                if (readiness > 9999) {
                    item.readiness = this.randomizeInterval(9999);
                    return -item.readiness;
                }
                item.readiness = readiness;
                return -item.readiness;
            }, this));
            this.set('held', held).cache();
            this.trigger('schedule:sorted');
            return this.data;
        },
        /**
         * @method splice
         * @param {Number} position
         * @returns {Object}
         */
        splice: function(position) {
            return this.data.splice(position, 1);
        },
        /**
         * @method update
         * @param {Backbone.Model} item
         */
        update: function(item) {
            var held = this.get('held');
            var history = this.get('history');
            var position = _.findIndex(this.data, {id: item.id});
            var relatedItemIds = item.getRelatedIds();
            //update the direct schedule item
            this.data[position] = {
                id: item.id,
                last: item.get('last'),
                next: item.get('next'),
                vocabIds: item.get('vocabIds')
            };
            //remove hold on directly updated item
            delete held[item.id];
            //keeps a maximum schedule history of five items
            history.unshift(this.getItemBaseWriting(item.id));
            if (history.length > 5) {
                history.pop();
            }
            //place holds on related items for sorting
            for (var i = 0, length = relatedItemIds.length; i < length; i++) {
                if (!held[relatedItemIds[i]]) {
                    held[relatedItemIds[i]] = skritter.fn.getUnixTime() + 60 * 10;
                }
            }
            this.set('history', history);
            this.trigger('schedule:updated');
        }
    });

    return Schedule;
});