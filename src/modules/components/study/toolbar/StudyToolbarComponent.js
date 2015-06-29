/**
 * @module Application
 * @submodule Components
 */
define([
    'core/modules/GelatoComponent',
    'require.text!modules/components/study/toolbar/study-toolbar-template.html'
], function(GelatoComponent, Template) {

    /**
     * @class StudyToolbarComponent
     * @extends GelatoComponent
     */
    var StudyToolbarComponent = GelatoComponent.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
        },
        /**
         * @method render
         * @returns {StudyToolbarComponent}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method updateGoalProgress
         */
        updateGoalProgress: function() {
            var element = this.$('#goal-progress .progress-bar');
            var value = app.user.data.stats.getGoalItemPercent();
            element.css('width', value + '%');
            element.text(value + '%');
        }
    });

    return StudyToolbarComponent;

});