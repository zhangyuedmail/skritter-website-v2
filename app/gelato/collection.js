/**
 * @class GelatoCollection
 * @extends {Backbone.Collection}
 */
let GelatoCollection = Backbone.Collection.extend({
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
    let originalOptions = _.clone(options);
    options.error = (function() {
      this.state = 'standby';
      this._triggerState();
      if (typeof originalOptions.error === 'function') {
        originalOptions.error(...arguments);
      }
    }).bind(this);
    options.success = (function() {
      this.state = 'standby';
      this._triggerState();
      if (typeof originalOptions.success === 'function') {
        originalOptions.success(...arguments);
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
  },
});

module.exports = GelatoCollection;
