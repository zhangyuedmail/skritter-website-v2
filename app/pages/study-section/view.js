var Page = require('base/page');
var DefaultNavbar = require('navbars/default/view');
var Prompt = require('components/prompt/view');
var StudyToolbar = require('components/study-toolbar/view');
var Vocablist = require('models/vocablist');
var Items = require('collections/items');

/**
 * @class StudySection
 * @extends {Page}
 */
module.exports = Page.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.listId = options.listId;
        this.sectionId = options.sectionId;
        this.items = new Items();
        this.navbar = new DefaultNavbar();
        this.prompt = new Prompt();
        this.toolbar = new StudyToolbar(null, {page: this});
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
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @method render
     * @returns {StudySection}
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
        if (this.listId) {
            this.items.createListItems(
                [this.listId],
                function(result) {
                    $.notify(
                        {
                            icon: 'fa fa-plus-circle',
                            title: '',
                            message: result.numVocabsAdded + ' word has been added.'
                        },
                        {
                            type: 'minimalist',
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
        }
    },
    /**
     * @method handleToolbarSaveStudySettings
     * @param {Object} settings
     */
    handleToolbarSaveStudySettings: function(settings) {
        this.items.reset();
        this.prompt.reset();
        this.app.user.set(settings, {merge: true}).cache();
        this.app.user.save();
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
                this.items.fetchByVocabIds(
                    this.vocablist.getSectionVocabIds(this.sectionId),
                    function() {
                        callback();
                    },
                    function(error) {
                        callback(error);
                    }
                );
            }, this),
            _.bind(function(callback) {
                async.each(
                    this.items.models,
                    function(item, callback) {
                        if (item.isKosher()) {
                            callback();
                        } else {
                            item.set('next', moment());
                            item.save(
                                {'next': moment().add('2', 'weeks').unix()},
                                {
                                    error: function(error) {
                                        callback(error)
                                    },
                                    success: function() {
                                        callback();
                                    }
                                }
                            )
                        }
                    },
                    function(error) {
                        callback(error);
                    }
                );
            }, this)
        ], function(error) {
            if (error) {
                callbackError(error);
            } else {
                callbackSuccess();
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
                this.items.fetchNext();
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
     * @returns {StudySection}
     */
    remove: function() {
        this.navbar.remove();
        this.prompt.remove();
        return Page.prototype.remove.call(this);
    }
});
