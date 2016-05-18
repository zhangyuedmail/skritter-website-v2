/**
 * @class GelatoModel
 * @extends {Backbone.Model}
 */
var GelatoModel = Backbone.Model.extend({
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
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  /**
   * @method save
   * @param [attributes]
   * @param [options]
   */
  save: function(attributes, options) {
    options = options || {};
    this.state = 'saving';
    this._triggerState();
    this._handleRequestEvent(options);
    return Backbone.Model.prototype.save.call(this, attributes, options);
  },
  /**
   * @method _handleRequestEvent
   * @param {Object} options
   * @private
   */
  _handleRequestEvent: function(options) {
    var originalOptions = _.clone(options);
    options.error = (function() {
      this.state = 'standby';
      this._triggerState();
      if (typeof originalOptions.error === 'function') {
        originalOptions.error.apply(originalOptions, arguments);
      }
    }).bind(this);
    options.success = (function() {
      this.state = 'standby';
      this._triggerState();
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

module.exports = GelatoModel;
