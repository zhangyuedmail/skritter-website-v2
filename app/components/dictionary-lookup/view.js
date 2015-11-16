var Component = require('base/component');

/**
 * @class DictionaryLookup
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.vocab = null;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/dictionary-lookup/template'),
    /**
     * @method render
     * @returns {Component}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method renderSelect
     * @returns {DictionaryLookup}
     */
    renderSelect: function() {
        var options = '';
        for (var source in this.links) {
            options += '<option value="' +  this.links[source] +'">';
            options += source;
            options += '</option>';
        }
        this.$('#dictionary-list').html(options);
        return this;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #button-lookup': 'handleClickLookup'
    },
    /**
     * @method handleClickLookup
     * @param {Event} event
     */
    handleClickLookup: function(event) {
        event.preventDefault();
        var href = this.$('select').val().replace('href-', '');
        window.open(href, '_blank');
    },
    /**
     * @method load
     * @param {Object} dictionaryLinks
     * @returns {DictionaryLookup}
     */
    set: function(dictionaryLinks) {
        this.links = dictionaryLinks || {};
        this.renderSelect().show();
        return this;
    }
});
