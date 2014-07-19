define([
    'require.text!template/prompt-teaching-buttons.html',
    'view/View'
], function(template, View) {
    /**
     * @class TeachingButtons
     */
    var TeachingButtons = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {TeachingButtons}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, View.prototype.events, {
                'vclick #button-next': 'handleClickTeachingNext',
                'vclick #button-repeat': 'handleClickTeachingRepeat'
            });
        },
        /**
         * @method handleClickTeachingNext
         * @param {Object} event
         */
        handleClickTeachingNext: function(event) {
            this.triggerNext();
            event.preventDefault();
        },
        /**
         * @method handleClickTeachingRepeat
         * @param {Object} event
         */
        handleClickTeachingRepeat: function(event) {
            this.triggerRepeat();
            event.preventDefault();
        },
        /**
         * @method hide
         * @param {Function} callback
         * @returns {TeachingButtons}
         */
        hide: function(callback) {
            this.$el.hide(0, callback);
            return this;
        },
        /**
         * @method show
         * @param {Function} callback
         * @returns {TeachingButtons}
         */
        show: function(callback) {
            this.$el.show(0, callback);
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