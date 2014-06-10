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
            this.expanded = true;
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
         * @method collapse
         * @returns {Backbone.View}
         */
        collapse: function() {
            this.expanded = false;
            for (var i = 1; i <= 4; i++) {
                if (i === this.grade) {
                    this.$('#grade' + i).show();
                } else {
                    this.$('#grade' + i).hide();
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
                    this.$('#grade' + i).addClass('selected');
                } else {
                    this.$('#grade' + i).removeClass('selected');
                }
                this.$('#grade' + i).show(300);
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
         * @returns {Backbone.View}
         */
        hide: function() {
            this.$el.hide();
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
         * @method select
         * @param {Number} grade
         * @returns {Backbone.View}
         */
        select: function(grade) {
            this.grade = grade;
            for (var i = 1; i <= 4; i++) {
                if (i === this.grade) {
                    this.$('#grade' + i).addClass('selected');
                } else {
                    this.$('#grade' + i).removeClass('selected');
                }
            }
            return this;
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            this.$el.show();
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

    return View;
});