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
            this.expanded = true;
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
                'vclick.GradingButtons #grade1': 'handleButtonClick',
                'vclick.GradingButtons #grade2': 'handleButtonClick',
                'vclick.GradingButtons #grade3': 'handleButtonClick',
                'vclick.GradingButtons #grade4': 'handleButtonClick'
            });
        },
        /**
         * @method collapse
         * @returns {PromptGradingButtons}
         */
        collapse: function() {
            this.expanded = false;
            for (var i = 1; i <= 4; i++) {
                if (i === this.grade) {
                    this.$('#grade' + i).parent().show();
                } else {
                    this.$('#grade' + i).parent().hide();
                }
            }
            return this;
        },
        /**
         * @method expand
         * @returns {PromptGradingButtons}
         */
        expand: function() {
            for (var i = 1; i <= 4; i++) {
                if (i === this.grade) {
                    this.$('#grade' + i).parent().addClass('active');
                } else {
                    this.$('#grade' + i).parent().removeClass('active');
                }
                this.$('#grade' + i).parent().show();
            }
            this.expanded = true;
            return this;
        },
        /**
         * @method handleButtonClick
         * @param {Object} event
         */
        handleButtonClick: function(event) {
            this.grade = parseInt(event.currentTarget.id.replace(/[^\d]+/, ''), 10);
            this.select(this.grade);
            this.triggerSelected();
            if (this.expanded) {
                this.triggerComplete();
            } else {
                this.expand();
            }
            event.preventDefault();
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
            this.grade = grade;
            for (var i = 1; i <= 4; i++) {
                if (i === this.grade) {
                    this.$('#grade' + i).parent().addClass('active');
                } else {
                    this.$('#grade' + i).parent().removeClass('active');
                }
            }
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