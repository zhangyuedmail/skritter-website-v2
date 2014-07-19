define([
    'require.text!template/test.html',
    'view/View',
    'jasmine-boot'
], function(template, View) {
    /**
     * @class Test
     */
    var Test = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Test}
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
         */
        loadElements: function() {
        }
    });
    
    return Test;
});