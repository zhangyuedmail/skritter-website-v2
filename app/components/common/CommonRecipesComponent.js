const GelatoComponent = require('gelato/component');

/**
 * Cooks delicious, well-seasoned meals for the user
 * @class CommonRecipesComponent
 * @extends {GelatoComponent}
 */
const CommonRecipesComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #recipe': 'cookNewDish',
  },

  /**
   * The currently selected recipe
   * @type {String}
   */
  currentRecipe: null,

  /**
   * Timer that switches out the current recipe after it's been on the menu for
   * too long.
   * @type {Number} id of the timer
   */
  timer: null,

  /**
   * Prepares the recipes according to the user's tastes.
   * @method initialize
   */
  initialize: function() {
    let recipes = app.locale('recipes');

    recipes = [].concat(recipes['general'])
      .concat(app.isChinese() ? recipes['zh'] : [])
      .concat(app.isJapanese() ? recipes['ja'] : []);

    this.recipes = recipes;
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./CommonRecipes'),

  /**
   * @method render
   * @returns {CommonRecipesComponent}
   */
  render: function() {
    this.renderTemplate();

    this._startTimer();

    return this;
  },

  /**
   * @method remove
   * @returns {CommonRecipesComponent}
   */
  remove: function() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    return GelatoComponent.prototype.remove.call(this);
  },

  /**
   * Adds the secret spice to the user's dish
   * @method cookNewDish
   * @returns {String} a flavorful dish
   */
  cookNewDish: function() {
    const newFavoriteDish = Math.floor(this.recipes.length * Math.random(Date.now()));

    this.currentRecipe = this.recipes[newFavoriteDish];
    this.$('#recipe').text(this.currentRecipe.quote);
    this.$('#recipe').prop('title', this.currentRecipe.source || '');

    return this.currentRecipe;
  },

  /**
   * Starts a timer that will switch out the user's dish after it gets too cold.
   * @private
   */
  _startTimer: function() {
    const self = this;

    // switch every two minutes
    this.timer = setInterval(function() {
      self.cookNewDish();
    }, 120000);
  },

});

module.exports = CommonRecipesComponent;
