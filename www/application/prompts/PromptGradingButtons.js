/**
 * @module Application
 */
define([
    'framework/BaseView',
    'require.text!templates/desktop/prompts/prompt-grading-buttons.html'
], function(BaseView, DesktopTemplate) {
    /**
     * @class PromptGradingButtons
     * @extend {BaseView}
     */
    var PromptGradingButtons = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.grade = 3;
        },
        /**
         * @method render
         * @returns {PromptGradingButtons}
         */
        render: function() {
            this.$el.html(this.compile(DesktopTemplate));
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-grading': 'handleGradingButtonClicked'
            });
        },
        /**
         * @method getScore
         * @returns {Number}
         */
        getScore: function() {
            return this.grade;
        },
        /**
         * @method handleGradingButtonClicked
         * @param {Object} event
         */
        handleGradingButtonClicked: function(event) {
            event.stopPropagation();
            var grade = parseInt(event.currentTarget.id.replace('grade', ''), 10);
            this.triggerSelected();
            if (this.grade === grade) {
                this.triggerComplete();
            }
            this.select(grade);
        },
        /**
         * @method hide
         * @param {Function} [callback]
         * @returns {PromptGradingButtons}
         */
        hide: function(callback) {
            this.$el.hide(0, callback);
            return this;
        },
        /**
         * @method reset
         * @returns {PromptGradingButtons}
         */
        reset: function() {
            this.grade = 3;
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
         * @param {Function} [callback]
         * @returns {PromptGradingButtons}
         */
        show: function(callback) {
            this.$el.show(0, callback);
            return this;
        },
        /**
         * @method triggerComplete
         */
        triggerComplete: function() {
            this.trigger('complete', this.grade);
        },
        /**
         * @method triggerSelected
         */
        triggerSelected: function() {
            this.trigger('selected', this.grade);
        }
    });

    return PromptGradingButtons;
});
