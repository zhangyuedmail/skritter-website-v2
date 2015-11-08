var Component = require('base/component');
var Vocablists = require('collections/vocablists');

/**
 * @class DashboardQueue
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        //this.listenTo(app.user.data.stats, 'fetch', this.updateLearned);
        this.vocablists = new Vocablists();
        this.listenTo(this.vocablists, 'state', this.render);
        this.vocablists.fetch({
            data: {
                limit: 10,
                sort: 'adding',
                include_percent_done: 'true',
                lang: app.getLanguage()
            }
        });
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {DashboardQueue}
     */
    render: function() {
        this.renderTemplate();
        return this;
    }
});
