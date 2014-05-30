define([
    'require.text!template/home.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class Home
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
            this.element.avatar = this.$('.user-avatar');
            this.element.username = this.$('.user-username');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
            });
        }
    });
    
    return View;
    
});