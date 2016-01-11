var GelatoPage = require('gelato/page');

var Prompt = require('components1/study/prompt/view');
var Toolbar = require('components1/study/toolbar/view');
var Items = require('collections/items');
var Navbar = require('navbars/default/view');

/**
 * @class Study
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        ScreenLoader.show();
        this.navbar = new Navbar();
        this.prompt = new Prompt();
        this.queue = [];
        this.schedule = new Items();
        this.scheduleState = 'standby';
        this.toolbar = new Toolbar({page: this});
        this.listenTo(this.schedule, 'populate', this.handleSchedulePopulate);
        this.listenTo(this.schedule, 'load', this.handleScheduledLoad);
        this.listenTo(this.prompt, 'next', this.handlePromptNext);
        this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
        this.loadSchedule();
    },
    /**
     * @property events
     * @type Object
     */
    events: {},
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Study - Skritter',
    /**
     * @method render
     * @returns {Study}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.prompt.setElement('#study-prompt-container').render();
        this.toolbar.setElement('#study-toolbar-container').render();
        return this;
    },
    /**
     * @method handleScheduledLoad
     */
    handleScheduledLoad: function() {
        ScreenLoader.post('Preparing for study mode');
        this.populateQueue();
    },
    /**
     * @method handleSchedulePopulate
     */
    handleSchedulePopulate: function() {
        if (this.prompt.isLoaded()) {
            console.info('QUEUE:', 'Added more items to queue.');
        } else {
            ScreenLoader.hide();
            this.next();
        }
    },
    /**
     * @method handlePromptNext
     * @param {PromptReviews} reviews
     */
    handlePromptNext: function(reviews) {
        this.toolbar.timer.addLocalOffset(reviews.getBaseReviewingTime());
        this.schedule.addReviews(reviews.getItemReviews());
        if (this.schedule.reviews.length > 4) {
            this.schedule.reviews.post();
        }
        this.next();
    },
    /**
     * @method handlePromptPrevious
     * @param {PromptReviews} reviews
     */
    handlePromptPrevious: function(reviews) {
        this.previous();
    },
    /**
     * @method loadSchedule
     */
    loadSchedule: function() {
        var self = this;
        var parts = app.user.getStudyParts();
        var styles = app.user.getStudyStyles();
        app.db.items
            .toArray()
            .then(function(items) {
                items = items.filter(function(item) {
                    if (!item.vocabIds.length) {
                        return false;
                    } else if (parts.indexOf(item.part) === -1) {
                        return false;
                    } else if (styles.indexOf(item.style) === -1) {
                        return false;
                    }
                    return true;
                });
                self.schedule.set(items.splice(0, 1000));
                self.schedule.trigger('load', self.schedule);
            })
            .catch(function(error) {
                self.schedule.trigger('error', error);
            });
    },
    /**
     * @method next
     */
    next: function() {
        var item = this.queue.shift();
        if (item) {
            this.toolbar.render();
            this.toolbar.timer.reset();
            this.prompt.set(item.getPromptReviews());
            if (this.scheduleState === 'standby' && this.queue.length < 5) {
                this.scheduleState = 'populating';
                this.populateQueue();
            }
        } else {
            console.error('ITEM LOAD ERROR:', 'no items');
        }
    },
    /**
     * @method populateQueue
     */
    populateQueue: function() {
        var self = this;
        var items = [];
        //store base histories for better spacing
        var localHistory = [];
        var queueHistory = this.queue.map(function(item) {
            return item.getBase();
        });
        //creates an array items to queue
        for (var i = 0, length = this.schedule.sort().length; i < length; i++) {
            var item = this.schedule.at(i);
            var itemBase = item.getBase();
            if (items.length < 10 && item.get('vocabIds').length) {
                if (localHistory.indexOf(itemBase) === -1 &&
                    queueHistory.indexOf(itemBase) === -1) {
                    localHistory.push(itemBase);
                    items.push(item);
                }
            } else {
                break;
            }
        }
        //fetch resource data for queue items
        this.schedule.fetch({
            data: {
                ids: _.pluck(items, 'id').join('|'),
                include_contained: true,
                include_decomps: true,
                include_sentences: true,
                include_strokes: true,
                include_vocabs: true
            },
            merge: false,
            remove: false,
            error: function(error) {
                self.schedule.trigger('error', error);
                self.scheduleState ='standby';
            },
            success: function(items, result) {
                var now = moment().unix();
                var sortedItems = _.sortBy(result.Items, function(item) {
                    var readiness = 0;
                    if (!item.last) {
                        readiness = 9999;
                    } else {
                        readiness = (now - item.last) / (item.next - item.last);
                    }
                    return -readiness;
                });
                for (var i = 0, length = sortedItems.length; i < length; i++) {
                    self.queue.push(self.schedule.get(sortedItems[i].id));
                }
                self.schedule.trigger('populate', self.queue);
                self.scheduleState ='standby';
            }
        });
    },
    /**
     * @method previous
     */
    previous: function() {
        //TODO: allow going back a prompt
    },
    /**
     * @method remove
     * @returns {Study}
     */
    remove: function() {
        this.navbar.remove();
        this.prompt.remove();
        this.toolbar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
