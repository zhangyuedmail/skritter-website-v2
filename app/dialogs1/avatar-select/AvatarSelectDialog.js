const GelatoDialog = require('gelato/dialog');

/**
 * @class AvatarSelectDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .avatar': 'handleClickAvatar',
    'click .button-close': 'handleClickClose',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./AvatarSelectDialog.jade'),

  /**
   * An array of our local avatars.
   * @property avatars
   * @type {Array}
   */
  avatars: [
    'art_new',
    'attack',
    'bird',
    'bullfight',
    'calligraphy_pen',
    'choco_revenge',
    'cloud',
    'code_monkey',
    'comic_dude',
    'crane_man',
    'crazy_man',
    'cube',
    'cute_thing',
    'dancer',
    'dead_friends',
    'diamond',
    'dj',
    'domo_news',
    'flower',
    'fox',
    'fridge',
    'happy_head',
    'harp',
    'hippo',
    'ice_cream_cone',
    'iceberg',
    'jazz_horse',
    'leprechaun',
    'manta_ray',
    'michael_trooper',
    'platy',
    'pomegranate',
    'preposterous',
    'science',
    'science_bomb',
    'science_rock',
    'small_car',
    'springy_knight',
    'squirrel',
    'teddybear',
    'the_future',
    'washington',
    'win',
    'yarrr',
  ],

  /**
   * @method render
   * @returns {AvatarSelectDialog}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  handleClickAvatar: function(event) {
    event.preventDefault();

    this.trigger('select', $(event.target).data('id'));
    this.close();
  },

  /**
   * @method handleClickClose
   * @param {Event} event
   */
  handleClickClose: function(event) {
    event.preventDefault();

    this.trigger('close');
    this.close();
  },

  /**
   * Returns an array of row groups for displaying avatars.
   * @returns {Array}
   */
  getAvatarRows: function() {
    return _.chunk(this.avatars, 4);
  },

  /**
   * Returns a string file path where the avatars are located.
   * @returns {String}
   */
  getFilePath: function() {
    return app.isCordova() ? 'media/avatars/' : '/media/avatars/';
  },
});
