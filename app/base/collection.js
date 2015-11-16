/**
 * @class Collection
 * @extends {Backbone.Collection}
 */
module.exports = Backbone.Collection.extend({
    /**
     * @property state
     * @type {String}
     */
    state: 'standby',
    /**
     * @method fetch
     * @param {Object} [options]
     */
    fetch: function(options) {
        options = options || {};
        this.state = 'fetching';
        this._triggerState();
        this._handleRequestEvent(options);
        return Backbone.Collection.prototype.fetch.call(this, options);
    },
    /**
     * @method _handleRequestEvent
     * @param {Object} options
     * @private
     */
    _handleRequestEvent: function(options) {
        var originalOptions = _.clone(options);
        options.complete = (function() {
            this._triggerState();
            if (typeof originalOptions.complete === 'function') {
                originalOptions.complete.apply(originalOptions, arguments);
            }
        }).bind(this);
        options.error = (function() {
            this.state = 'standby';
            if (typeof originalOptions.error === 'function') {
                originalOptions.error.apply(originalOptions, arguments);
            }
        }).bind(this);
        options.success = (function() {
            this.state = 'standby';
            if (typeof originalOptions.success === 'function') {
                originalOptions.success.apply(originalOptions, arguments);
            }
        }).bind(this);
    },
    /**
     * @method _triggerState
     * @private
     */
    _triggerState: function() {
        this.trigger('state', this.state, this);
        this.trigger('state:' + this.state, this);
    }
});
