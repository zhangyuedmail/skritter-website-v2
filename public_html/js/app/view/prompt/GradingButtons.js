define([
    'require.text!template/prompt-grading-buttons.html',
    'view/View'
], function(template, View) {
    /**
     * @class PromptGradingButtons
     */
    var PromptGradingButtons = View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            View.prototype.initialize.call(this);
            this.grade = 3;
        },
        /**
         * @method render
         * @returns {PromptGradingButtons}
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
                'vclick .button-grading': 'handleClickGrading'
            });
        },
        /**
         * @method handleClickGrading
         * @param {Object} event
         */
        handleClickGrading: function(event) {
            var grade = parseInt(event.currentTarget.id.replace('grade', ''), 10);
            this.triggerSelected(event, grade);
            if (this.grade === grade) {
                this.triggerComplete(event, grade);
            }
            this.select(grade);
            event.stopPropagation();
        },
        /**
         * @method hide
         * @param {Function} callback
         * @returns {PromptGradingButtons}
         */
        hide: function(callback) {
            this.$el.hide(0, callback);
            return this;
        },
        /**
         * @method select
         * @param {Number} grade
         * @returns {PromptGradingButtons}
         */
        select: function(grade) {
            for (var i = 1; i <= 4; i++) {
                if (i === grade) {
                    this.$('#grade' + i).addClass('active');
                } else {
                    this.$('#grade' + i).removeClass('active');
                }
            }
            this.grade = grade;
            return this;
        },
        /**
         * @method show
         * @param {Function} callback
         * @returns {PromptGradingButtons}
         */
        show: function(callback) {
            this.$el.show(0, callback);
            return this;
        },
        /**
         * @method triggerComplete
         * @param {Object} event
         * @param {Number] grade
         */
        triggerComplete: function(event, grade) {
            this.trigger('complete', event, grade);
        },
        /**
         * @method triggerSelected
         * @param {Object} event
         * @param {Number] grade
         */
        triggerSelected: function(event, grade) {
            this.trigger('selected', event, grade);
        }
    });

    return PromptGradingButtons;
});