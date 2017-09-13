const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class SessionModel
 * @extends {SkritterModel}
 */
const SessionModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'user_id',

  /**
   * @property defaults
   * @type {Object}
   */
  defaults: {
    created: 0,
    expires_in: 0
  },
  /**
   * @property url
   * @type {String}
   */
  url: 'oauth2/token',

  /**
   * @method initialize
   * @param {Object} [attributes]
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(attributes, options) {
    options = options || {};
    this.user = options.user;
  },

  /**
   * @method authenticate
   * @param {String} type
   * @param {String} username
   * @param {String} password
   * @param {Function} callbackSuccess
   * @param {Function} callbackError
   */
  authenticate: function(type, username, password, callbackSuccess, callbackError) {
    this.fetch({
      data: {
        client_id: this.getClientId(),
        grant_type: type,
        password: password,
        username: username
      },
      type: 'post',
      success: _.bind(function(model) {
        this.set('created', moment().unix(), {silent: true});
        callbackSuccess(model);
      }, this),
      error: _.bind(function(model, error) {
        callbackError(error, model);
      }, this)
    });
  },

  /**
   * @method cache
   */
  cache: function() {
    app.setLocalStorage(this.user.id + '-session', this.toJSON());
  },

  /**
   * @method getClientId
   * @returns {String}
   */
  getClientId: function() {
    switch (app.getPlatform()) {
      case 'Android':
        return 'skritterandroid';
      case 'iOS':
        return 'skritterios';
      default:
        return 'skritterweb';
    }
  },

  /**
   * @method getExpires
   * @returns {Number}
   */
  getExpires: function() {
    return this.get('created') + this.get('expires_in');
  },

  /**
   * A token is expired if it is more than two weeks old.
   * @method isExpired
   * @returns {Boolean}
   */
  isExpired: function() {
    return this.getExpires() < moment().unix();
  },

  /**
   * A token is refreshable if it will expire in less than a week.
   * @method isRefreshable
   * @returns {Boolean}
   */
  isRefreshable: function() {
    return moment(this.getExpires() * 1000).subtract(1, 'week').unix() < moment().unix();
  },

  /**
   * @method getHeaders
   * @returns {Object}
   */
  getHeaders: function() {
    return {'Authorization': 'bearer ' + this.get('access_token')};
  },

  /**
   * @method getLoginCredentials
   * @returns {String}
   */
  getLoginCredentials: function() {
    switch (app.getPlatform()) {
      case 'Android':
        return 'c2tyaXR0ZXJhbmRyb2lkOmRjOTEyYzAzNzAwMmE3ZGQzNWRkNjUxZjBiNTA3NA==';
      case 'iOS':
        return 'c2tyaXR0ZXJpb3M6NGZmYjFiZDViYTczMWJhNTc1YWI4OWYzYzY5ODQ0';
      default:
        return 'c2tyaXR0ZXJ3ZWI6YTI2MGVhNWZkZWQyMzE5YWY4MTYwYmI4ZTQwZTdk';
    }
  },
  /**
   * @method getLoginHeaders
   * @returns {Object}
   */
  getLoginHeaders: function() {
    return {'Authorization': 'basic ' + this.getLoginCredentials()};
  },

  /**
   * @method headers
   * @returns {Object}
   */
  headers: function() {
    return this.getLoginHeaders();
  },

  /**
   * @method refresh
   * @param {Function} callbackSuccess
   * @param {Function} callbackError
   */
  refresh: function(callbackSuccess, callbackError) {
    this.fetch({
      data: {
        client_id: this.getClientId(),
        grant_type: 'refresh_token',
        refresh_token: this.get('refresh_token')
      },
      type: 'POST',
      success: _.bind(function(model) {
        this.set('created', moment().unix(), {silent: true});
        callbackSuccess(model);
      }, this),
      error: _.bind(function(model, error) {
        callbackError(error, model);
      }, this)
    });
  }

});

module.exports = SessionModel;
