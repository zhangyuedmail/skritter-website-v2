var GelatoPage = require('gelato/page');

var DefaultNavbar = require('navbars/default/view');
var Table = require('components/vocablists/browse-table/view');
var Sidebar = require('components/vocablists/sidebar/view');

/**
 * @class VocablistBrowse
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new Sidebar();
        this.table = new Table();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'change input[type="checkbox"]': 'handleChangeCheckbox',
        'keyup #list-search-input': 'handleKeypressListSearchInput',
        'click #list-option': 'handleClickListOption',
        'click #grid-option': 'handleClickGridOption'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Browse - Skritter',
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        this.table.setElement('#vocablist-container').render();
        return this;
    },
    /**
     * @method handleChangeCheckbox
     */
    handleChangeCheckbox: function() {
        /** TODO: support checkbox filters
        var checkedBoxes = $('input[type="checkbox"]:checked');
        var filterTypes = checkedBoxes.map(function(i, el) {
            return $(el).attr('name');
        });
        this.table.setFilterTypes(filterTypes);
        this.table.render();
         **/
    },
    /**
     * @method onClickListOption
     * @param {Event} event
     */
    handleClickListOption: function(event) {
        event.preventDefault();
        this.table.setLayout('list');
        this.$('#list-option').addClass('chosen');
        this.$('#grid-option').removeClass('chosen');
    },
    /**
     * @method onClickGridOption
     * @param {Event} event
     */
    handleClickGridOption: function(event) {
        event.preventDefault();
        this.table.setLayout('grid');
        this.$('#list-option').removeClass('chosen');
        this.$('#grid-option').addClass('chosen');
    },
    /**
     * @method handleKeypressListSearchInput
     * @param {Event} event
     */
    handleKeypressListSearchInput: function(event) {
        this.table.setFilterString(event.target.value);
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        this.table.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
