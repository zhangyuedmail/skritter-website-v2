define([
    'require.text!template/study.html',
    'base/View'
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
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Study - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
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
         */
        loadPrompt: function() {
            
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            
        }
    });
    
    return View;
});