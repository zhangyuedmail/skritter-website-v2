var GelatoPage = require('gelato/page');

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
        this.items = this.createCollection('collections/items');
        this.navbar = this.createComponent('navbars/default');
        this.prompt = this.createComponent('components/prompt');
        this.toolbar = this.createComponent('components/study-toolbar', {page: this});
        this.vocablist = this.createCollection('models/vocablist', {id: options.listId});
        this.listenTo(this.prompt, 'next', this.handlePromptNext);
        this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
        this.listenTo(this.prompt, 'review:next', this.handlePromptReviewNext);
        this.listenTo(this.prompt, 'review:previous', this.handlePromptReviewPrevious);
        this.listenTo(this.prompt, 'review:start', this.handlePromptReviewStart);
        this.listenTo(this.prompt, 'review:stop', this.handlePromptReviewStop);
        this.listenTo(this.prompt, 'skip', this.handlePromptSkip);
        this.listenTo(this.toolbar, 'click:add-item', this.handleToolbarAddItem);
        this.listenTo(this.toolbar, 'save:study-settings', this.handleToolbarSaveStudySettings);
        this.load();
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
        this.items.reviews.save();
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
    },
    /**
     * @method handleToolbarSaveStudySettings
     * @param {Object} settings
     */
    handleToolbarSaveStudySettings: function(settings) {
        this.prompt.remove();
        this.prompt = this.createComponent('components/prompt');
        this.prompt.setElement('#prompt-container').render();
        this.app.user.set(settings, {merge: true}).cache();
        this.items = this.createCollection('collections/items');
        this.items.fetchNext(
            {listId: this.listId},
            _.bind(function() {
                this.next();
            }, this)
        );
    },
    /**
     * @method load
     */
    load: function() {
        async.waterfall([
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
                this.items.fetchNext(
                    {listId: this.listId},
                    function() {
                        callback();
                    },
                    function() {
                        callback();
                    }
                );
            }, this)
        ], _.bind(function(error, items) {
            if (error) {
                console.error('ITEM LOAD ERROR:', error, items);
            } else {
                this.toolbar.render();
                this.items.fetchNext({
                    cursor: this.items.cursor,
                    listId: this.listId
                });
                this.next();
            }
        }, this));
    },
    /**
     * @method next
     */
    next: function() {
        var nextItem = this.items.getNext();
        if (this.prompt) {
            if (nextItem) {
                this.toolbar.timer.reset();
                this.prompt.set(nextItem.getPromptReviews());
            } else {
                console.error('ITEM LOAD ERROR:', 'no items');
            }
        }
        if (!this.sectionId && this.counter % 10 === 0) {
            console.log('LOADING MORE ITEMS:', 10);
            this.items.fetchNext({listId: this.listId});
        }
    },
    /**
     * @method previous
     */
    previous: function() {},
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
