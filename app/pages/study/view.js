var GelatoPage = require('gelato/modules/page');
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
        this.prompt = new Prompt();
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Study - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/study/template'),
    /**
     * @method render
     * @returns {GelatoPage}
     */
    render: function() {
        this.renderTemplate();
        this.prompt.setElement('#prompt-container').render().hide();
        return this;
    },
    /**
     * @method load
     * @param {String} [listId]
     * @param {String} [sectionId]
     */
    load: function(listId, sectionId) {
        if (app.user.schedule.getNext()) {
            app.closeDialog();
            this.next();
        } else {
            app.openDialog('loading');
            this.listenToOnce(app.user.schedule, 'update', $.proxy(this.load, this));
        }
    },
    next: function() {
        var item = app.user.schedule.getNext();
        var reviews = item.getPromptReviews();
        this.prompt.set(reviews);
        this.prompt.show();
    }
});
