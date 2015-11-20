var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var Prompt = require('components/prompt/view');
var StudyToolbar = require('components/study-toolbar/view');
var Items = require('collections/items');
var Vocablist = require('models/vocablist');

/**
 * @class StudyList
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.counter = 1;
        this.listId = options.listId;
        this.items = new Items();
        this.navbar = new DefaultNavbar();
        this.prompt = new Prompt();
        this.toolbar = new StudyToolbar({page: this});
        this.vocablist = new Vocablist({id: options.listId});
        this.listenTo(this.prompt, 'next', this.handlePromptNext);
        this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
        this.listenTo(this.prompt, 'review:next', this.handlePromptReviewNext);
        this.listenTo(this.prompt, 'review:previous', this.handlePromptReviewPrevious);
        this.listenTo(this.prompt, 'review:start', this.handlePromptReviewStart);
        this.listenTo(this.prompt, 'review:stop', this.handlePromptReviewStop);
        this.listenTo(this.prompt, 'skip', this.handlePromptSkip);
        this.listenTo(this.toolbar, 'click:add-item', this.handleToolbarAddItem);
        this.listenTo(this.toolbar, 'save:study-settings', this.handleToolbarSaveStudySettings);
        this.items.comparator = function(item) {
            return -item.getReadiness();
        };
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
     * @returns {StudyList}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.prompt.setElement('#prompt-container').render();
        this.toolbar.setElement('#toolbar-container').render();
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
        this.counter++;
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
     * @method handlePromptReviewNext
     * @param {PromptReviews} reviews
     */
    handlePromptReviewNext: function(reviews) {},
    /**
     * @method handlePromptPrevious
     * @param {PromptReviews} reviews
     */
    handlePromptReviewPrevious: function(reviews) {},
    /**
     * @method handlePromptPrevious
     * @param {PromptReviews} reviews
     */
    handlePromptReviewStart: function(reviews) {
        //this.toolbar.timer.start();
    },
    /**
     * @method handlePromptPrevious
     * @param {PromptReviews} reviews
     */
    handlePromptReviewStop: function(reviews) {
        //this.toolbar.timer.stop();
    },
    /**
     * @method handlePromptSkip
     * @param {PromptReviews} reviews
     */
    handlePromptSkip: function(reviews) {
        this.next();
    },
    /**
     * @method handleToolbarAddItem
     */
    handleToolbarAddItem: function() {
        this.items.addItems(
            {vocab_list: this.listId},
            function(result) {
                var added = result.numVocabsAdded;
                $.notify(
                    {
                        title: 'Update',
                        message: added + (added > 1 ? ' words have ' : ' word has ')  + 'been added.'
                    },
                    {
                        type: 'pastel-info',
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        delay: 5000,
                        icon_type: 'class'
                    }
                );
            }
        );
    },
    /**
     * @method handleToolbarSaveStudySettings
     * @param {Object} settings
     */
    handleToolbarSaveStudySettings: function(settings) {
        this.items.reset();
        this.prompt.reset();
        app.user.set(settings, {merge: true}).cache();
        app.user.save();
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
     * @method loadMore
     * @param {Function} [callbackSuccess]
     * @param {Function} [callbackError]
     */
    loadMore: function(callbackSuccess, callbackError) {
        async.series([
            _.bind(function(callback) {
                this.vocablist.fetch({
                    error: function(items, error) {
                        callback(error);
                    },
                    success: function() {
                        callback();
                    }
                })
            }, this),
            _.bind(function(callback) {
                this.items.cursor = null;
                this.items.fetchNext(
                    {listId: this.listId},
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
                        {cursor: this.items.cursor, listId: this.listId},
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
        return GelatoPage.prototype.remove.call(this);
    }
});
