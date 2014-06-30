define([
    'require.text!template/prompt-grading-buttons.html'
], function(template) {
    /**
     * @class PromptGradingButtons
     */
    var PromptGradingButtons = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
            this.expanded = true;
            this.grade = 3;
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
            'vclick.GradingButtons #grade1': 'handleButtonClick',
            'vclick.GradingButtons #grade2': 'handleButtonClick',
            'vclick.GradingButtons #grade3': 'handleButtonClick',
            'vclick.GradingButtons #grade4': 'handleButtonClick'
        },
        /**
         * @method collapse
         * @returns {Backbone.View}
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
         * @method destroy
         */
        destroy: function() {
            var keys = _.keys(this);
            for (var key in keys) {
                this[keys[key]] = undefined;
            }
        },
        /**
         * @method expand
         * @returns {Backbone.View}
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
            this.$el.remove();
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
         * @method select
         * @param {Number} grade
         * @returns {Backbone.View}
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
         * @returns {Backbone.View}
         */
        show: function(callback) {
            this.$el.show('slide', {direction: 'down'}, this.speed, callback);
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