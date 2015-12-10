var GelatoComponent = require('gelato/component');
var Timer = require('components1/study/toolbar/timer/view');

/**
 * @class StudyToolbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.timer = new Timer();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-add-item': 'handleClickAddItem',
        'vclick #button-list-settings': 'handleClickListSettings',
        'vclick #button-study-settings': 'handleClickStudySettings'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyToolbar}
     */
    render: function() {
        this.renderTemplate();
        this.timer.setElement('#timer-container').render();
        return this;
    },
    /**
     * @function remove
     * @returns {StudyToolbar}
     */
    remove: function() {
        this.timer.remove();
        return this;
    }
});
