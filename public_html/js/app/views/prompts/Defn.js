/**
 * @module Skritter
 * @submodule Views
 * @param templateDefn
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-defn.html',
    'views/prompts/Prompt'
], function(templateDefn, Prompt) {
    /**
     * @class PromptDefn
     */
    var Defn = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateDefn);
            this.$('#input-container').hammer().on('tap', _.bind(this.handleTap, this));
            Prompt.prototype.render.call(this);
        },
        /**
         * @method handleTap
         * @returns {undefined}
         */
        handleTap: function(event) {
            Prompt.gradingButtons.show();
            event.preventDefault();
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            settings = settings ? settings : skritter.settings;
            if (settings.orientation() === 'landscape') {
                this.$('#input-container').height(settings.height());
                this.$('#input-container').width(settings.height());
            } else {
                this.$('#input-container').height(settings.width());
                this.$('#input-container').width(settings.width());
            }
            Prompt.prototype.resize.call(this, settings);
        },
        /**
         * @method show
         */
        show: function() {
            this.$('.prompt-writing-input').html(Prompt.review.vocab().writing());
            this.$('.prompt-question').html("What's the definition?");
            this.showWriting();
            this.showReading();
            this.showSentence();
        }
    });
    
    return Defn;
});