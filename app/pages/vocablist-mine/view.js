var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-mine-table/view');

/**
 * @class VocablistMine
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
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/vocablist-mine/template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'My Lists - Skritter',
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.vocablistTable.setElement('#vocablist-container').render();
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
