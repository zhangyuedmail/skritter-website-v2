var GelatoPage = require('gelato/page');
var NavbarLoggedIn = require('components/navbar-logged-in/view');
var Vocablist = require('models/vocablist');

/**
 * @class VocablistView
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.vocablist = new Vocablist({id: options.vocablistId});
        this.vocablist.fetch();

        //this.listenTo(this.vocablist, 'state', this.render);

        // Hack until state event and property works.
        this.listenTo(this.vocablist, 'sync', function() {
            this.vocablist.state = 'standby';
            this.render();
        });

        this.navbar = new NavbarLoggedIn();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'click #add-to-queue-btn': 'handleClickAddToQueueButton'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Vocab List - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistView}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistView}
     */
    remove: function() {
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method handleClickAddToQueueButton
     */
    handleClickAddToQueueButton: function() {
        if (this.vocablist.get('studyingMode') === 'not studying') {
            this.vocablist.set('studyingMode', 'adding');
            this.vocablist.save();
            this.render();
        }
    }
});
