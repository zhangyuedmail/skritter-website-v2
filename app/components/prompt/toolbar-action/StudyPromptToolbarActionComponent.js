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
  initialize: function (options) {
    this.prompt = options.prompt;
    this.buttonState = options.buttonState || {
      show: true,
      teach: true,
      erase: true,
      correct: true,
      disableCorrect: false,
    };

    this.buttonWidth = this.buttonState.disableCorrect ? '33.3%' : '25%';
  },

  /**
   * @method render
   * @returns {StudyPromptToolbarActionComponent}
   */
  render: function () {
    this.renderTemplate();

    this.$('.btn-wrapper').css({width: this.buttonWidth});

    return this;
  },

  update () {
    const {showAnyButtons, showCorrectBtn} = this.getButtonProperties();

    this.$('gelato-component').toggleClass('hidden', !showAnyButtons);

    this.$('#toolbar-stroke-order').toggleClass('disabled', !this.buttonTeach || !this.buttonState.teach);
    this.$('.icon-study-stroke-order').toggleClass('disabled', !this.buttonTeach || !this.buttonState.teach);

    this.$('#toolbar-erase').toggleClass('disabled', !this.buttonErase || !this.buttonState.erase);
    this.$('.icon-study-erase').toggleClass('disabled', !this.buttonErase || !this.buttonState.erase);

    this.$('#toolbar-show').toggleClass('disabled', !this.buttonShow || !this.buttonState.show);
    this.$('.icon-study-show').toggleClass('disabled', !this.buttonShow || !this.buttonState.show);

    this.$('#toolbar-correct').toggleClass('disabled', !showCorrectBtn || !this.buttonState.correct);
    this.$('.icon-study-dont-know').toggleClass('disabled', !this.buttonCorrect || !this.buttonState.correct);
  },

  getButtonProperties () {
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
  handleClickToolbarCorrect: function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.trigger('click:correct');
  },

  /**
   * @method handleClickToolbarErase
   * @param {Event} event
   */
  handleClickToolbarErase: function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.trigger('click:erase');
  },

  /**
   * @method handleClickToolbarShow
   * @param {Event} event
   */
  handleClickToolbarShow: function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.trigger('click:show');
  },

  /**
   * @method handleClickToolbarStrokeOrder
   * @param {Event} event
   */
  handleClickToolbarStrokeOrder: function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.trigger('click:teach');
  },

  setPromptType (type, update) {
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
