var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-browse-table/view');

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
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #list-option': 'handleClickListOption',
        'vclick #grid-option': 'handleClickGridOption',
        'change input[type="checkbox"]': 'handleChangeCheckbox',
        'keyup #list-search-input': 'handleKeypressListSearchInput'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/vocablist-browse/template'),
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
        this.vocablistTable.fields = {name: 'Name'};
        this.vocablistTable.setElement('#vocablist-container').render();
        app.user.data.vocablists.fetchOfficial();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.vocablistTable.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method onClickListOption
     */
    handleClickListOption: function() {
        this.vocablistTable.layout = 'list';
        this.$el.find('#list-option').addClass('chosen');
        this.$el.find('#grid-option').removeClass('chosen');
        this.vocablistTable.render();
    },
    /**
     * @method onClickGridOption
     */
    handleClickGridOption: function() {
        this.vocablistTable.layout = 'grid';
        this.$el.find('#list-option').removeClass('chosen');
        this.$el.find('#grid-option').addClass('chosen');
        this.vocablistTable.render();
    },
    /**
     * @method handleChangeCheckbox
     */
    handleChangeCheckbox: function() {
        var checkedBoxes = $('input[type="checkbox"]:checked');
        var filterTypes = checkedBoxes.map(function(i, el) {
            return $(el).attr('name');
        });
        this.vocablistTable.setFilterTypes(filterTypes);
        this.vocablistTable.render();
    },
    /**
     * @method handleKeypressListSearchInput
     */
    handleKeypressListSearchInput: function() {
        var searchString = this.$el.find('#list-search-input').val();
        this.vocablistTable.setSearchString(searchString);
        this.vocablistTable.render();
    }
});
