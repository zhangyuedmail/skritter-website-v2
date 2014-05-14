/**
 * @module Skritter
 * @submodule View
 * @param templateModal
 * @author Joshua McFarland
 */
define([
    'require.text!template/modals.html'
], function(templateModal) {
    /**
     * @class Modal
     */
    var Modal = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.id = null;
            this.options = null;
            this.$el.on('hide.bs.modal', _.bind(function() {
                this.id = null;
                this.$('*').off();
                this.render();
            }, this));
            this.$el.on('show.bs.modal', _.bind(function(event) {
                if (this.$el.children().hasClass('in')) {
                    this.$el.children('.in').modal('hide').one('hidden.bs.modal', _.bind(function() {
                        this.$(Modal.element).modal(this.options);
                    }, this));
                    event.preventDefault();
                }
            }, this));
        },
        /**
         * @property {DOMElement} el
         */
        el: $('#modal-container'),
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateModal);
            return this;
        },
        /**
         * Hides the modal and calls back when it has finished hiding.
         * 
         * @method hide
         * @param {Function} callback
         */
        hide: function(callback) {
            this.element().modal('hide').one('hidden.bs.modal', _.bind(function() {
                if (typeof callback === 'function')
                    callback();
            }, this));
        },
        /**
         * Returns the element of the current active modal.
         * 
         * @method element
         * @param {String} selector
         * @returns {DOMElement}
         */
        element: function(selector) {
            if (selector)
                return this.$el.find('#' + this.id + ' ' + selector);
            return this.$el.find('#' + this.id);
        },
        /**
         * @method isDisplayed
         * @returns {Boolean}
         */
        isDisplayed: function() {
            return this.id ? true : false;
        },
        /**
         * @method progress
         * @param {Number} percent
         * @returns {Backbone.View}
         */
        progress: function(percent) {
            percent = percent ? Math.round(percent) : 0;
            this.element('.progress-bar').width(percent + '%');
            this.element('.progress-bar .sr-only').text(percent + '% Complete');
            return this;
        },
        /**
         * Resets the active modals display and classes to the defaults.
         * 
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            this.element('.progress-bar').attr('classes', 'modal-footer');
            this.element('.progress-bar').attr('classes', 'modal-header');
            this.element('.progress-bar').attr('classes', 'modal-title');
            this.element('.progress-bar').find('*').show();
            return this;
        },
        /**
         * Finds and sets the active modal html and attribute values.
         * 
         * @method set
         * @param {String} findBy
         * @param {String} html
         * @param {Array|String} atrribute
         * @returns {Backbone.View}
         */
        set: function(findBy, html, atrribute) {
            var atributes = Array.isArray(atrribute) ? atrribute : [atrribute];
            var element = this.element().find(findBy);
            if (html === false) {
                element.hide();
            } else {
                element.addClass(atributes.join(' '));
                element.html(html);
            }
            return this;
        },
        /**
         * Displays a popup modal dialog based on one of the template ids. It also takes options
         * for how to handle the backdrop, keyboard, show and remote options specificed by Boostrap.
         * 
         * @method show
         * @param {String} id
         * @param {Function} callback
         * @param {Object} options
         * @returns {Backbone.View}
         */
        show: function(id, callback, options) {
            id = id ? id : 'default';
            this.id = id;
            options = (options) ? options : {};
            options.backdrop = (options.backdrop) ? options.backdrop : 'static';
            options.keyboard = (options.keyboard) ? options.keyboard : false;
            options.show = (options.show) ? options.show : true;
            options.remote = (options.remote) ? options.remote : false;
            this.options = options;
            this.$('#' + id).modal(options).one('shown.bs.modal', _.bind(function() {
                if (typeof callback === 'function')
                    callback();
            }, this));
            this.reset();
            return this;
        }
    });
    
    return Modal;
});