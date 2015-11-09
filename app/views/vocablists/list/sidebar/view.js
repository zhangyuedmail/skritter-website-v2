var Component = require('base/component');

/**
 * @class VocablistsListSidebar
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.vocablist = options.vocablist;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistsListSidebar}
     */
    render: function() {
        this.renderTemplate();
    }
});
