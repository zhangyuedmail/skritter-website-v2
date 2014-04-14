/**
 * @module Skritter
 * @submodule Functions
 * @class Scheduler
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method interval
     * @param {Backbone.Model} item
     * @param {Number} grade
     * @returns {Number}
     */
    var interval = function(item, grade) {
        var config = skritter.user.data.srsconfigs.get(item.get('part'));
        var newInterval;
        //return new items with randomized default config values
        if (!item.has('last')) {
            switch (grade) {
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
            return randomizeInterval(newInterval);
        }
        //set values for further calculations
        var actualInterval = skritter.fn.getUnixTime() - item.get('last');
        var factor;
        var pctRight = item.get('successes') / item.get('reviews');
        var scheduledInterval = item.get('next') - item.get('last');
        //get the factor 
        if (grade === 2) {
            factor = 0.9;
        } else if (grade === 4) {
            factor = 3.5;
        } else {
            var factorsList = (grade === 1) ? config.get('wrongFactors') : config.get('rightFactors');
            var divisions = [2, 1200, 18000, 691200];
            var index;
            for (var i in divisions)
                if (item.get('interval') > divisions[i])
                    index = i;
            factor = factorsList[index];
        }
        //adjust the factor based on readiness
        if (grade > 2) {
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
        newInterval = randomizeInterval(item.get('interval') * factor);
        //bound the interval
        if (grade === 1) {
            if (newInterval > 604800) {
                newInterval = 604800;
            } else if (newInterval < 30) {
                newInterval = 30;
            }
        } else {
            if (newInterval > 315569260) {
                newInterval = 315569260;
            } else if (grade === 2 && newInterval < 300) {
                newInterval = 300;
            } else if (newInterval < 30) {
                newInterval = 30;
            }
        }
        return newInterval;
    };
    /**
     * @method randomizeInterval
     * @param {Number} interval
     * @returns {Number}
     */
    var randomizeInterval = function(interval) {
        return Math.round(interval * (0.925 + (Math.random() * 0.15)));
    };
    
    return {
        interval: interval,
        randomizeInterval: randomizeInterval
    };
});


