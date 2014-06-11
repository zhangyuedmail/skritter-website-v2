define([
    'require.text!template/test.html',
    'base/View',
    'jasmine-boot'
], function(template, BaseView) {
    /**
     * @class Test
     */
    var Test = BaseView.extend({
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
            require([
                'spec/Functions'
            ], function() {
                window.runJasmine();
            });
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
        }
    });
    
    return Test;
});