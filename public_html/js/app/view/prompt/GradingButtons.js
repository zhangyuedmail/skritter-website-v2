define([
    'require.text!template/prompt-grading-buttons.html'
], function(template) {
    /**
     * @class PromptGradingButtons
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.grade = 3;
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
            'vclick.GradingButtons #grade1': 'handleButtonClick',
            'vclick.GradingButtons #grade2': 'handleButtonClick',
            'vclick.GradingButtons #grade3': 'handleButtonClick',
            'vclick.GradingButtons #grade4': 'handleButtonClick'
        },
        /**
         * @method handleButtonClick
         * @param {Object} event
         */
        handleButtonClick: function(event) {
            this.select(parseInt(event.currentTarget.id.replace(/[^\d]+/, ''), 10));
            this.triggerSelected();
            event.preventDefault();
        },
        /**
         * @method hide
         * @returns {Backbone.View}
         */
        hide: function() {
            this.$el.hide('slide', {direction: 'down'}, 200);
            return this;
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            this.$el.show('slide', {direction: 'down'}, 200);
            return this;
        },
        /**
         * @method triggerSelected
         */
        triggerSelected: function() {
            this.trigger('selected', this.grade);
        }
    });
    
    return View;
});