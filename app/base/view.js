var globals = require('globals');

/**
 * @class View
 * @extends {Backbone.View}
 */
module.exports = Backbone.View.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: null,
    /**
     * @method getHeight
     * @returns {Number}
     */
    getHeight: function() {
        return this.$el.height();
    },
    /**
     * @method getWidth
     * @returns {Number}
     */
    getWidth: function() {
        return this.$el.width();
    },
    /**
     * @method handleClickHref
     * @param {Event} event
     */
    handleClickHref: function(event) {
        var target = $(event.currentTarget);
        var href = target.attr('href');
        if (window.app !== undefined &&
            href.indexOf('#') !== 0 &&
            href.indexOf('http://') !== 0 &&
            href.indexOf('https://') !== 0) {
            event.preventDefault();
            window.app.router.navigate(href, {
                replace: target.data('replace') || false,
                trigger: target.data('trigger') || true
            });
        }
    },
    /**
     * @method handleResize
     * @param {Event} event
     */
    handleResize: function(event) {
        this.trigger('resize', event);
    },
    /**
     * @method getContext
     * @param {Object} [context]
     * @returns {Object}
     */
    getContext: function(context) {
        globals.app = window.app;
        globals.view = this;
        globals = $.extend(true, globals, context || {});
        return globals;
    },
    /**
     * @method hide
     * @returns {View}
     */
    hide: function() {
        this.$el.hide(arguments.length ? arguments : 0);
        return this;
    },
    /**
     * @method remove
     * @returns {View}
     */
    remove: function() {
        this.stopListening();
        this.undelegateEvents();
        this.$el.find('*').off();
        this.$el.empty();
        Backbone.$(window).off('resize', this.handleResize.bind(this));
        return this;
    },
    /**
     * @method renderTemplate
     * @param {Object} [context]
     * @returns {View}
     */
    renderTemplate: function(context) {
        this.$el.html(this.template(this.getContext(context)));
        this.$('a[href]').on('click vclick', this.handleClickHref.bind(this));
        Backbone.$(window).off('resize', this.handleResize.bind(this));
        Backbone.$(window).on('resize', this.handleResize.bind(this));
        return this;
    },
    /**
     * @method show
     * @returns {View}
     */
    show: function() {
        this.$el.show(arguments.length ? arguments : 0);
        return this;
    }
});
