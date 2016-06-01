var GelatoPage = require('gelato/page');

/**
 * @class Test
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @property title
   * @type {String}
   */
  title: 'Test - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {AccountSettingsGeneral}
   */
  render: function() {
    this.renderTemplate();
    $.ajax({
      url: 'js/test.js',
      context: this,
      dataType: "script",
      success: this.load
    });
    return this;
  },

  /**
   * @method load
   */
  load: function() {
    mocha.setup('bdd');
    require('test/index');
    mocha.checkLeaks();
    mocha.globals(['gaplugins']);
    mocha.run();
  },

  /**
   * @method remove
   * @returns {AccountSettingsGeneral}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});
