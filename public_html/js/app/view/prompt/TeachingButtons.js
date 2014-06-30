define([
    'require.text!template/prompt-teaching-buttons.html'
], function(template) {
    /**
     * @class TeachingButtons
     */
    var TeachingButtons = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.speed = 50;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick #button-next': 'handleTeachingNextClick',
            'vclick #button-repeat': 'handleTeachingRepeatClick'
        },
        /**
         * @method destroy
         */
        destroy: function() {
            var keys = _.keys(this);
            for (var key in keys) {
                this[keys[key]] = undefined;
            }
        },
        /**
         * @method handleTeachingNextClick
         * @param {Object} event
         */
        handleTeachingNextClick: function(event) {
            this.triggerNext();
            event.preventDefault();
        },
        /**
         * @method handleTeachingRepeatClick
         * @param {Object} event
         */
        handleTeachingRepeatClick: function(event) {
            this.triggerRepeat();
            event.preventDefault();
        },
        /**
         * @method hide
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        hide: function(callback) {
            this.$el.hide('slide', {direction: 'down'}, this.speed, callback);
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            this.removeElements();
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
            this.destroy();
        },
        /**
         * @method removeElements
         * @returns {Object}
         */
        removeElements: function() {
            for (var i in this.elements) {
                this.elements[i].remove();
                this.elements[i] = undefined;
            }
            return this.elements;
        },
        /**
         * @method show
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        show: function(callback) {
            this.$el.show('slide', {direction: 'down'}, this.speed, callback);
            return this;
        },
        /**
         * @method triggerSelected
         */
        triggerNext: function() {
            this.trigger('next');
        },
        /**
         * @method triggerComplete
         */
        triggerRepeat: function() {
            this.trigger('repeat');
        }
    });

    return TeachingButtons;
});