var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-browse-table/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');
var DefaultNavbar = require('navbars/default/view');

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
        this.vocablistTable = new VocablistTable();
        this.navbar = new DefaultNavbar();
        this.sidebar = new VocablistSidebar();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'change input[type="checkbox"]': 'handleChangeCheckbox',
        'keyup #list-search-input': 'handleKeypressListSearchInput',
        'vclick #list-option': 'handleClickListOption',
        'vclick #grid-option': 'handleClickGridOption'
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
        this.navbar.render();
        this.vocablistTable.setElement('#vocablist-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
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
        this.vocablistTable.setFilterTypes(filterTypes);
        this.vocablistTable.render();
         **/
    },
    /**
     * @method onClickListOption
     * @param {Event} event
     */
    handleClickListOption: function(event) {
        event.preventDefault();
        this.vocablistTable.setLayout('list');
        this.$('#list-option').addClass('chosen');
        this.$('#grid-option').removeClass('chosen');
    },
    /**
     * @method onClickGridOption
     * @param {Event} event
     */
    handleClickGridOption: function(event) {
        event.preventDefault();
        this.vocablistTable.setLayout('grid');
        this.$('#list-option').removeClass('chosen');
        this.$('#grid-option').addClass('chosen');
    },
    /**
     * @method handleKeypressListSearchInput
     * @param {Event} event
     */
    handleKeypressListSearchInput: function(event) {
        this.vocablistTable.setFilterString(event.target.value);
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.vocablistTable.remove();
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
