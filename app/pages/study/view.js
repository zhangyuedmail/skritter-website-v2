var GelatoPage = require('gelato/page');
var LoadingDialog = require('dialogs/loading/view');
var Prompt = require('components/prompt/view');

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
        this.counter = 0;
        this.prompt = new Prompt();
        this.listenTo(this.prompt, 'complete', this.handlePromptComplete);
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #button-add-item': 'handleClickButtonAddItem'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/study/template'),
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
        this.prompt.setElement('#prompt-container').render().hide();
        return this;
    },
    /**
     * @method handleClickButtonAdd
     * @param {Event} event
     */
    handleClickButtonAddItem: function(event) {
        event.preventDefault();
        app.user.data.items.fetchNew();
    },
    /**
     * @method handlePromptComplete
     * @param {PromptReviews} reviews
     */
    handlePromptComplete: function(reviews) {
        var self = this;
        reviews.updateItems(function() {
            self.counter += reviews.length;
            if (self.counter >= 20) {
                self.counter = 0;
                app.user.data.items.fetchNext();
            }
            self.loadNext();
        }, function(error) {
            console.error('ITEM UPDATE ERROR:', error);
        });
    },
    /**
     * @method load
     * @param {String} [listId]
     * @param {String} [sectionId]
     */
    load: function(listId, sectionId) {
        if (app.user.data.items.getNext()) {
            if (this.dialog) {
                this.dialog.close();
            }
            this.loadNext();
        } else {
            this.listenToOnce(app.user.data.items, 'fetch:next', $.proxy(this.load, this));
            this.dialog = new LoadingDialog();
            this.dialog.open();
            app.user.data.items.fetchNext();
        }
    },
    /**
     * @method loadNext
     */
    loadNext: function() {
        var item = app.user.data.items.getNext();
        var reviews = item.getPromptReviews();
        this.prompt.set(reviews);
        this.prompt.show();
    },
    /**
     * @method remove
     * @returns {Study}
     */
    remove: function() {
        this.prompt.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
