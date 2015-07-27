var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-table/view');

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
     * @property title
     * @type {String}
     */
    title: 'Browse - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/vocablist-browse/template'),
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
    }
});
