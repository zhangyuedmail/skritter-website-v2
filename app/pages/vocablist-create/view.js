var GelatoPage = require('gelato/page');
var Vocablist = require('models/vocablist');

/**
 * @class NewVocablistPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.navbar = this.createComponent('navbars/default');
        this.vocablist = new Vocablist();
        this.errorMessage = '';
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'submit #new-list-form': 'handleSubmitNewListForm'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'New Vocab List - Skritter',
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {NewVocablistPage}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        return this;
    },
    /**
     * @method remove
     */
    remove: function() {
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method handleSubmitNewListForm
     * @param {Event} e
     */
    handleSubmitNewListForm: function(e) {
        e.preventDefault();
        this.errorMessage = '';
        this.vocablist.set({
            name: this.$('#name').val(),
            description: this.$('#description').val(),
            singleSect: this.$('#small-list-input').is(':checked'),
            lang: app.getLanguage()
        });
        this.vocablist.save();
        this.listenToOnce(this.vocablist, 'sync', function() {
            app.router.navigate("/vocablists/view/" + this.vocablist.id, {trigger: true});
        });
        this.listenToOnce(this.vocablist, 'error', function(model, jqxhr) {
            this.errorMessage = jqxhr.responseJSON.message;
            this.stopListening(this.vocablist);
            this.renderSubmitArea();
        });
        this.renderSubmitArea();
    },
    /**
     * @method renderSubmitArea
     */
    renderSubmitArea: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('#submit-area').replaceWith(rendering.find('#submit-area'));
    }
});
