var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-browse-table/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');

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
        this.navbar = this.createComponent('navbars/default');
        this.sidebar = new VocablistSidebar();
        this.vocablistTable = new VocablistTable();
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
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        this.vocablistTable.setElement('#vocablist-container').render();
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
        this.navbar.remove();
        this.sidebar.remove();
        this.vocablistTable.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
