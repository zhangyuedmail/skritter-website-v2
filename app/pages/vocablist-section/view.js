var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var User = require('models/user');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');

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
        this.navbar = new DefaultNavbar();
        this.vocablist = new Vocablist({id: options.vocablistId});
        this.vocablist.fetch({data: {fields: 'name'}});
        this.section = new VocablistSection({vocablistId: options.vocablistId, id:options.sectionId});
        this.section.fetch();
        this.listenTo(this.vocablist, 'state', this.render);
        this.listenTo(this.section, 'state', this.render);
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Vocab List Section - Skritter',
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
    }
});
