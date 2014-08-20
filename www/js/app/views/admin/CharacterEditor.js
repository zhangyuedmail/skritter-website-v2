/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "require.text!templates/admin-character-editor.html",
    "app/collections/prompts/PromptCharacter",
    "app/models/prompts/PromptStroke",
    "app/models/data/DataStroke",
    "app/models/data/DataVocab",
    "app/views/prompts/Canvas"
], function(GelatoPage, template, PromptCharacter, PromptStroke, DataStroke, DataVocab, PromptCanvas) {
    return GelatoPage.extend({
        /**
         * @class ViewCharacterEditor
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {
            this.canvas = new PromptCanvas();
            this.character = undefined;
            this.stroke = new DataStroke();
            this.vocab = new DataVocab();
            this.writing = undefined;
        },
        /**
         * @property title
         * @type String
         */
        title: "Character Editor",
        /**
         * @method render
         * @returns {ViewCharacterEditor}
         */
        render: function() {
            this.$el.html(this.compile(template));
            this.canvas.setElement(this.$(".canvas-container")).render();
            this.resize();
            return this;
        },
        /**
         * @method renderStroke
         * @returns {ViewCharacterEditor}
         */
        renderStroke: function() {
            this.character = new PromptCharacter().setVariations(this.stroke);
            this.canvas.drawShape("stroke", this.character.variations[0].getContainer(this.canvas.getSize()));
            return this;
        },
        /**
         * @method resize
         * @returns {ViewCharacterEditor}
         */
        resize: function() {
            this.canvas.resize(this.getContent().height() - 4);
            return this;
        },
        /**
         * @method set
         * @param {String} writing
         * @returns {ViewCharacterEditor}
         */
        set: function(writing) {
            var self = this;
            this.writing = writing;
            app.api.getVocabByQuery(this.writing, function(result) {
                self.stroke.set(result.Strokes[0]);
                self.vocab.set(result.Vocabs[0]);
                self.renderStroke();
            }, {include_strokes: true});
            return this;
        }
    });
});
