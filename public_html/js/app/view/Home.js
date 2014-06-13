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
            window.document.title = "Home - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
            this.elements.dueCount.text(skritter.user.scheduler.getDueCount(true));
            if (!skritter.user.sync.isActive()) {
                this.sync();
            }
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
            BaseView.prototype.renderElements.call(this);
            this.elements.dueCount = this.$('.due-count');
            this.elements.listCount = this.$('.list-count');
            this.elements.buttonSync = this.$('.button-sync');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-lists': 'handleListsClicked',
                'vclick .button-sync': 'handleSyncClicked'
            });
        },
        /**
         * @method handleListsClicked
         * @param {Object} event
         */
        handleListsClicked: function(event) {
            skritter.router.navigate('vocab/list', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleSyncClicked
         * @param {Object} event
         */
        handleSyncClicked: function(event) {
            this.sync();
            event.preventDefault();
        },
        /**
         * @method sync
         */
        sync: function() {
            if (!skritter.user.sync.isActive()) {
                this.elements.buttonSync.addClass('fa-spin');
                skritter.user.sync.changedItems(_.bind(function() {
                    this.elements.buttonSync.removeClass('fa-spin');
                }, this));
            }
        }
    });
    
    return View;
    
});