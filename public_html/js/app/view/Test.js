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
            this.setTitle('Test');
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this);
            require([
                'spec/Functions'
            ], function() {
                window.runJasmine();
            });
            return this;
        },
        /**
         * @method loadElements
         * @returns {Backbone.View}
         */
        loadElements: function() {
            BaseView.prototype.loadElements.call(this);
            return this;
        }
    });
    
    return Test;
});