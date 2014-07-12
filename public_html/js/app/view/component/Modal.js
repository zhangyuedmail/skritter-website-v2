define([
    'require.text!template/modals.html'
], function(template) {
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
            this.render();
        },
        /**
         * @property {DOMElement} el
         */
        el: $('.modal-container'),
        /**
         * @method render
         * @returns {Modal}
         */
        render: function() {
            this.$el.html(_.template(template));
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
                if (typeof callback === 'function') {
                    callback();
                }
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
            if (selector) {
                return this.$el.find('#' + this.id + ' ' + selector);
            }
            return this.$el.find('#' + this.id);
        },
        /**
         * @method isHidden
         * @returns {Boolean}
         */
        isHidden: function() {
            return this.id ? false : true;
        },
        /**
         * @method isVisible
         * @returns {Boolean}
         */
        isVisible: function() {
            return this.id ? true: false;
        },
        /**
         * @method progress
         * @param {Number} percent
         * @returns {Modal}
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
         * @returns {Modal}
         */
        reset: function() {
            this.element().find('*').show();
            return this;
        },
        /**
         * Finds and sets the active modal html and attribute values.
         * 
         * @method set
         * @param {String} findBy
         * @param {String} html
         * @param {Array|String} attribute
         * @returns {Modal}
         */
        set: function(findBy, html, attribute) {
            var attributes = Array.isArray(attribute) ? attribute : [attribute];
            var element = this.element().find(findBy);
            if (html === false) {
                element.hide();
            } else {
                element.addClass(attributes.join(' '));
                if (html) {
                    element.html(html);
                }
                element.show();
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
         * @returns {Modal}
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
                if (typeof callback === 'function') {
                    callback();
                }
            }, this));
            this.reset();
            return this;
        },
        /**
         * @method showAddItems
         */
        showAddItems: function() {
            var self = this;
            this.show('add-items');
            this.element('.modal-footer').hide();
            this.element('.item-limit').on('vclick', function(event) {
                this.select();
                event.preventDefault();
            });
            this.element('.button-add').on('vclick', function(event) {
                event.preventDefault();
                $.notify('Looking for items to add.', {
                    className: 'info',
                    position: 'top right'
                });
                var limit = self.element('.item-limit').val();
                if (limit >= 1 && limit <= 20) {
                    skritter.user.data.addItems(limit, function(addCount) {
                        if (addCount > 0) {
                            $.notify('Added ' + addCount + ' items!', {
                                className: 'success',
                                position: 'top right'
                            });
                        } else {
                            $.notify('No items to add.', {
                                className: 'warn',
                                position: 'top right'
                            });
                        }
                    });
                    self.hide();
                } else {
                    self.element('.modal-footer').show('fade', 200);
                    self.element('.message').addClass('text-danger');
                    self.element('.message').text('Must be between 1 and 100.');
                }

            });
        },
        /**
         * @method showEditDefinition
         * @param {Backbobe.Model} vocab
         */
        showEditDefinition: function(vocab) {
            var self = this;
            var definition = vocab.getDefinition();
            this.show('edit-definition').set('.field-definition', definition);
            this.element('.button-save').on('vclick', function(event) {
                event.preventDefault();
                var newDefinition = self.element('.field-definition').val();
                if (newDefinition === '') {
                    vocab.set('customDefinition', '');
                } else if (newDefinition !== definition) {
                    vocab.set('customDefinition', newDefinition);
                }
                self.hide();
            });
        }
    });
    
    return Modal;
});