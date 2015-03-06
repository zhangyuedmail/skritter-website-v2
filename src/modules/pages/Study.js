/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/study.html',
    'core/modules/GelatoPage',
    'modules/components/Prompt',
    'modules/components/StudyToolbar'
], function(Template, GelatoPage, Prompt, StudyToolbar) {

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
            this.toolbar = new StudyToolbar();
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
            this.toolbar.setElement(this.$('.toolbar-container')).render();
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
            this.prompt.set(item.getVocab(), item.get('part'), item.isNew());
            return this;
        }
    });

    return PageStudy;

});