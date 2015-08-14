var GelatoComponent = require('gelato/component');
var MyVocablists = require('./vocablists');

/**
 * @class VocablistMineTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.vocablists = new MyVocablists();
        this.listenTo(this.vocablists, 'sync', this.render);
        this.vocablists.fetch({
            headers: { 'Authorization': 'bearer '+app.api.getToken() },
            context: self,
            data: {
                sort: 'custom'
            }
        });
    },
    /**
     * @property events
     * @typeof {Object}
     */
    events: {
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistMineTable}
     */
    render: function() {
        this.renderTemplate();
        return this;
    }
});
