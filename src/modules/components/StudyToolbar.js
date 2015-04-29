/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/study-toolbar.html',
    'core/modules/GelatoComponent'
], function(Template, GelatoComponent) {

    /**
     * @class StudyToolbar
     * @extends GelatoComponent
     */
    var StudyToolbar = GelatoComponent.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @method render
         * @returns {StudyToolbar}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {}
    });

    return StudyToolbar;

});