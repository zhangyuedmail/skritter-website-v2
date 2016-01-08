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
        this.items = new Items();
        this.navbar = new Navbar();
        this.prompt = new Prompt();
        this.toolbar = new Toolbar({page: this});
        this.listenTo(this.items, 'queue:load', this.handleItemsQueueLoad);
        this.listenTo(this.items, 'queue:populate', this.handleItemsQueuePopulate);
        this.listenTo(this.prompt, 'next', this.handlePromptNext);
        this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
        this.items.loadQueue();
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
     * @method handleItemsQueueLoad
     */
    handleItemsQueueLoad: function() {
        ScreenLoader.post('Preparing for study mode');
    },
    /**
     * @method handleItemsQueuePopulate
     */
    handleItemsQueuePopulate: function() {
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
        this.items.addReviews(reviews.getItemReviews());
        this.items.reviews.post();
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
     * @method next
     */
    next: function() {
        var item = this.items.queue.shift();
        if (item) {
            this.toolbar.render();
            this.toolbar.timer.reset();
            this.prompt.set(item.getPromptReviews());
            if (this.items.queue.length < 5) {
                this.items.populateQueue();
            }
        } else {
            console.error('ITEM LOAD ERROR:', 'no items');
        }
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
