/**
 * @module Application
 * @submodule Components
 */
define([
    'core/modules/GelatoComponent',
    'require.text!modules/components/prompt/toolbar/prompt-toolbar-template.html'
], function(GelatoComponent, Template) {

    /**
     * @class PromptToolbar
     * @extends GelatoComponent
     */
    var PromptToolbar = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.prompt = options.prompt;
        },
        /**
         * @method render
         * @returns {PromptToolbar}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick #toolbar-correct': 'handleClickOptionCorrect',
            'vclick #toolbar-eraser': 'handleClickOptionErase',
            'vclick #toolbar-show': 'handleClickOptionShow',
            'vclick #toolbar-teach': 'handleClickOptionTeach'
        },
        /**
         * @method handleClickOptionCorrect
         * @param {Event} event
         */
        handleClickOptionCorrect: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickOptionErase
         * @param {Event} event
         */
        handleClickOptionErase: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickOptionShow
         * @param {Event} event
         */
        handleClickOptionShow: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleClickOptionTeach
         * @param {Event} event
         */
        handleClickOptionTeach: function(event) {
            event.preventDefault();
        }
    });

    return PromptToolbar;

});