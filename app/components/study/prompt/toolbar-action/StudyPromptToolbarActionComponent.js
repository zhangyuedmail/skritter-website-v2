const GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptToolbarActionComponent
 * @extends {GelatoComponent}
 */
const StudyPromptToolbarActionComponent = GelatoComponent.extend({
  /**
   * @property events
   * @type Object
   */
  events: {
    'click #toolbar-correct': 'handleClickToolbarCorrect',
    'click #toolbar-erase': 'handleClickToolbarErase',
    'click #toolbar-show': 'handleClickToolbarShow',
    'click #toolbar-stroke-order': 'handleClickToolbarStrokeOrder',
  },

  /**
   * @property buttonCorrect
   * @type {Boolean}
   */
  buttonCorrect: true,

  /**
   * @property buttonErase
   * @type {Boolean}
   */
  buttonErase: true,

  /**
   * @property buttonShow
   * @type {Boolean}
   */
  buttonShow: true,

  /**
   * @property buttonTeach
   * @type {Boolean}
   */
  buttonTeach: true,

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPromptToolbarActionComponent.jade'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
  },

  /**
   * @method render
   * @returns {StudyPromptToolbarActionComponent}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  update() {
    const {showAnyButtons, showCorrectBtn} = this.getButtonProperties();

    this.$('gelato-component').toggleClass('hidden', !showAnyButtons);

    this.$('#toolbar-stroke-order').toggleClass('disabled', !this.buttonTeach);
    this.$('.icon-study-stroke-order').toggleClass('disabled', !this.buttonTeach);

    this.$('#toolbar-erase').toggleClass('disabled', !this.buttonErase);
    this.$('.icon-study-erase').toggleClass('disabled', !this.buttonErase);

    this.$('#toolbar-show').toggleClass('disabled', !this.buttonShow);
    this.$('.icon-study-show').toggleClass('disabled', !this.buttonShow);

    this.$('#toolbar-correct').toggleClass('disabled', !showCorrectBtn);
    this.$('.icon-study-dont-know').toggleClass('disabled', !this.buttonCorrect);
  },

  getButtonProperties() {
    const showAnyButtons = this.prompt.review && !(app.isMobile() && this.prompt.review.isComplete());
    const showCorrectBtn = this.buttonCorrect &&
      this.prompt.review &&
      !this.prompt.review.get('complete');

    return {showAnyButtons, showCorrectBtn};
  },

  /**
   * @method handleClickToolbarCorrect
   * @param {Event} event
   */
  handleClickToolbarCorrect: function(event) {
    event.preventDefault();
    this.trigger('click:correct');
  },

  /**
   * @method handleClickToolbarErase
   * @param {Event} event
   */
  handleClickToolbarErase: function(event) {
    event.preventDefault();
    this.trigger('click:erase');
  },

  /**
   * @method handleClickToolbarShow
   * @param {Event} event
   */
  handleClickToolbarShow: function(event) {
    event.preventDefault();
    this.trigger('click:show');
  },

  /**
   * @method handleClickToolbarStrokeOrder
   * @param {Event} event
   */
  handleClickToolbarStrokeOrder: function(event) {
    event.preventDefault();
    this.trigger('click:teach');
  },

  setPromptType(type, update) {
    switch (type) {
      case 'rune':
        this.buttonCorrect = true;
        this.buttonErase = true;
        this.buttonShow = true;
        this.buttonTeach = true;
        break;
      default:
        this.buttonCorrect = true;
        this.buttonErase = false;
        this.buttonShow = false;
        this.buttonTeach = false;
    }

    if (update) {
      this.update();
    }
  },

});

module.exports = StudyPromptToolbarActionComponent;
