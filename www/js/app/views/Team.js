/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "requirejs.text!templates/team.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewTeam
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: "Team",
        /**
         * @method render
         * @returns {GelatoPage}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        }
    });
});
