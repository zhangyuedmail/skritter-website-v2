define([
    'require.text!template/study.html',
    'base/View',
    'view/prompt/Defn',
    'view/prompt/Rdng',
    'view/prompt/Rune',
    'view/prompt/Tone'
], function(template, BaseView) {
    /**
     * @class Study
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.prompt = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Study - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
            this.nextPrompt();
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
            BaseView.prototype.renderElements.call(this);
        },
        /**
         * @method loadPrompt
         * @param {Backbone.Model} review
         */
        loadPrompt: function(review) {
            this.prompt = review.createView();
            this.prompt.setElement(this.$('.prompt-container'));
            this.prompt.render();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            skritter.user.scheduler.sort();
            skritter.user.scheduler.getNext(_.bind(function(item) {
                this.loadPrompt(item.createReview());
            }, this));
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            
        }
    });
    
    return View;
});