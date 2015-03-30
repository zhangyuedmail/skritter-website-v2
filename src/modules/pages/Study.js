/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/study.html',
    'core/modules/GelatoPage',
    'modules/components/Prompt'
], function(Template, GelatoPage, Prompt) {

    /**
     * @class PageStudy
     * @extends GelatoPage
     */
    var PageStudy = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.prompt = new Prompt();
        },
        /**
         * @property title
         * @type String
         */
        title: app.strings.study.title + ' - ' + app.strings.global.title,
        /**
         * @method render
         * @returns {PageStudy}
         */
        render: function() {
            this.renderTemplate(Template);
            this.renderFields();
            this.prompt.setElement(this.$('.prompt-container')).render();
            app.user.data.items.loadNext($.proxy(this.loadPrompt, this));
            return this;
        },
        /**
         * @method renderFields
         * @returns {PageStudy}
         */
        renderFields: function() {
            this.$('.settings-name').text(app.user.settings.get('name'));
            return this;
        },
        /**
         * @method loadPrompt
         * @param {DataItem} item
         * @returns {PageStudy}
         */
        loadPrompt: function(item) {
            //this.prompt.set(item.getVocab(), item.get('part'));
            this.prompt.set(item.getVocab(), 'rdng');
            return this;
        }
    });

    return PageStudy;

});