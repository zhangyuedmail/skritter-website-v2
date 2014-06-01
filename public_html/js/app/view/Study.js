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
            this.element.avatar.html(skritter.user.settings.getAvatar('img-circle'));
            this.element.username.text(skritter.user.settings.get('name'));
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
        }
    });
    
    return View;
});