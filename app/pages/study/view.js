var GelatoPage = require('gelato/page');

var Items = require('collections/items');
var Prompt = require('components1/study/prompt/view');
var Toolbar = require('components1/study/toolbar/view');
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
        this.navbar = new Navbar();
        this.toolbar = new Toolbar({page: this});

        this.prompt = new Prompt();
        this.listenTo(this.prompt, 'next', this.handlePromptNext);
        this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);

        this.items = new Items();
        this.items.comparator = function(item) {
            return -item.getReadiness();
        };

        app.showLoading(0);

        this.loadMore(
            _.bind(function() {
                this.next();
            }, this),
            _.bind(function() {
                this.next();
            }, this)
        );
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
     * @method loadMore
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    loadMore: function(callbackSuccess, callbackError) {
        async.series([
            _.bind(function(callback) {
                this.items.cursor = null;
                this.items.fetchNext(
                    null,
                    function() {
                        callback();
                    },
                    function() {
                        callback();
                    }
                );
            }, this),
            _.bind(function(callback) {
                if (this.items.cursor) {
                    this.items.fetchNext(
                        {cursor: this.items.cursor},
                        function() {
                            callback();
                        },
                        function() {
                            callback();
                        }
                    );
                } else {
                    callback();
                }
            }, this),
            _.bind(function(callback) {
                async.each(
                    this.items.models,
                    _.bind(function(item, callback) {
                        if (item.isKosher()) {
                            callback();
                        } else {
                            item.set('next', moment(item.get('next') * 1000).add('2', 'weeks').unix());
                            $.ajax({
                                url: app.getApiUrl() + 'items/' + item.id,
                                headers: app.user.session.getHeaders(),
                                context: this,
                                type: 'PUT',
                                data: JSON.stringify(item.toJSON()),
                                error: function(error) {
                                    callback(error);
                                },
                                success: function() {
                                    this.items.remove(item);
                                    callback();
                                }
                            });
                        }
                    }, this),
                    function(error) {
                        callback(error);
                    }
                );
            }, this)
        ], function(error) {
            if (error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            } else {
                app.hideLoading();
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }
        });
    },
    /**
     * @method getNextItem
     * @returns {Item}
     */
    getNextItem: function() {
        return this.items.sort().at(0);
    },
    /**
     * @method next
     */
    next: function() {
        var item = this.getNextItem();
        if (item) {
            this.toolbar.render();
            this.toolbar.timer.reset();
            this.prompt.set(item.getPromptReviews());
            this.counter++;
            if (this.counter % 10 === 0) {
                console.log('LOADING MORE ITEMS:', 10);
                this.loadMore();
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
