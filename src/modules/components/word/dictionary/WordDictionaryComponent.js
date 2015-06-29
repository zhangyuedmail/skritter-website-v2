/**
 * @module Application
 * @submodule Components
 */
define([
    'core/modules/GelatoComponent',
    'require.text!modules/components/word/dictionary/word-dictionary-template.html'
], function(
    GelatoComponent,
    Template
) {

    /**
     * @class WordDictionaryComponent
     * @extends GelatoComponent
     */
    var WordDictionaryComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.links = {};
        },
        /**
         * @method render
         * @returns {WordDictionaryComponent}
         */
        render: function() {
            this.hide().renderTemplate(Template);
            return this;
        },
        /**
         * @method renderSelect
         * @returns {WordDictionaryComponent}
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
         * @returns {WordDictionaryComponent}
         */
        set: function(dictionaryLinks) {
            this.links = dictionaryLinks || {};
            this.renderSelect().show();
            return this;
        }
    });

    return WordDictionaryComponent;

});