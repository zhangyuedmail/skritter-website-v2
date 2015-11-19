var GelatoPage = require('gelato/page');

var DefaultNavbar = require('navbars/default/view');
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
        this.navbar = new DefaultNavbar();
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
    title: 'Create Vocablist - Skritter',
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
     * @method handleSubmitNewListForm
     * @param {Event} event
     */
    handleSubmitNewListForm: function(event) {
        event.preventDefault();
        this.errorMessage = '';
        this.vocablist.set({
            name: this.$('#name').val(),
            description: this.$('#description').val(),
            sections: [{name: 'Section 1', rows: []}],
            singleSect: false,
            lang: app.getLanguage()
        });
        this.listenToOnce(this.vocablist, 'sync', function() {
            app.router.navigate("/vocablists/view/" + this.vocablist.id, {trigger: true});
        });
        this.listenToOnce(this.vocablist, 'error', function(model, jqxhr) {
            this.errorMessage = jqxhr.responseJSON.message;
            this.stopListening(this.vocablist);
        });
        this.vocablist.save();
    },
    /**
     * @method remove
     */
    remove: function() {
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
