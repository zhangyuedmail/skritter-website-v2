/**
 * @class GelatoView
 * @extends {Backbone.View}
 */
module.exports = Backbone.View.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: null,
    /**
     * @method renderEvents
     * @returns {GelatoView}
     */
    renderEvents: function() {
        var self = this;
        var resize = null;
        this.$('[data-dialog]').off().on('vclick', $.proxy(this.handleClickDataDialog, this));
        this.$('[data-navigate]').off().on('vclick', $.proxy(this.handleClickDataNavigate, this));
        $(window).resize(function(event) {
            clearTimeout(resize);
            resize = setTimeout(function() {
                self.trigger('resize', event);
            }, 100);
        });
    },
    /**
     * @method renderTemplate
     * @param {Object} [options]
     * @returns {GelatoView}
     */
    renderTemplate: function(options) {
        this.$el.html(this.template(options));
        this.renderEvents();
        return this;
    },
    /**
     * @method disableForm
     * @param {String} [selector]
     * @returns {GelatoView}
     */
    disableForm: function(selector) {
        this.$((selector ? selector + ' ' : '') + ':input').prop('disabled', true);
        return this;
    },
    /**
     * @method handleClickDataDialog
     * @param {Event} event
     */
    handleClickDataDialog: function(event) {
        event.preventDefault();
        var dialogName = $(event.currentTarget).data('dialog');
        if (!app.dialog) {
            app.openDialog(dialogName);
        }
    },
    /**
     * @method handleClickDataNavigate
     * @param {Event} event
     */
    handleClickDataNavigate: function(event) {
        event.preventDefault();
        var route = $(event.currentTarget).data('navigate') || '';
        var replace = $(event.currentTarget).data('replace') || false;
        var trigger = $(event.currentTarget).data('trigger') || true;
        app.router.navigate(route, {replace: replace, trigger: trigger});
    },
    /**
     * @method enableForm
     * @param {String} [selector]
     * @returns {GelatoView}
     */
    enableForm: function(selector) {
        this.$((selector ? selector + ' ' : '') + ':input').prop('disabled', false);
        return this;
    },
    /**
     * @method hide
     * @returns {GelatoView}
     */
    hide: function() {
        this.$el.hide();
        return this;
    },
    /**
     * @method remove
     * @returns {GelatoView}
     */
    remove: function() {
        this.$el.empty();
        this.$el.find('*').off();
        this.stopListening();
        this.undelegateEvents();
        $(window).off('resize');
        return this;
    },
    /**
     * @method show
     * @returns {GelatoView}
     */
    show: function() {
        this.$el.show();
        return this;
    }
});
