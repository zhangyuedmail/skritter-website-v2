const GelatoComponent = require('gelato/component');

/**
 * A component that displays basic user info and provides a list of top-level
 * application navigation links.
 */
const DemoProgressComponent = GelatoComponent.extend({

  /**
   * CSS class for the element
   * @default
   */
  className: 'demo-progress-component',

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #skip-btn': 'handleSkipButtonClick'
  },

  /**
   * Element tag name
   * @default
   */
  tagName: 'gelato-component',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./DemoProgress.jade'),

  /**
   *
   */
  stepData: {
    languageSelection: {
      number: 1,
      name: "Language Selection"
    },
    teachDemoChar1: {
      number: 2,
      name: "First Characters"
    }
  },

  /**
   * Initializes a demo progress component
   * @param {Object} options data needed to initialize the view
   * @param {UserModel} options.user the app's usermodel. Must be passed in
   *                                 due to global app variable not available yet.
   */
  initialize: function(options) {
    this.demoPage = options.demoPage;
    this.numDemoSteps = Object.keys(this.stepData).length;
    this.firstStep = options.firstStep || this.stepData[OBject.keys[this.stepData][0]];

    this.listenTo(this.demoPage, 'step:update', this.updateStep);
  },

  render: function() {
    this.renderTemplate();

    this.updateStep(this.firstStep);

    return this;
  },

  /**
   * Handles when the user clicks the settings button and navigates to
   * the settings page.
   * @param {jQuery.Event} e the click event
   */
  handleSkipButtonClick: function(e) {
    this.trigger('demo:skip');
  },

  /**
   * Updates the progress bar indicator to reflect which step of the demo
   * the user is currently on
   * @param {String} step the current step
   */
  updateStep: function(step) {
    const stepInfo = this.stepData[step];

    const progressPercent = (stepInfo.number / this.numDemoSteps) * 100;

    this.$('.progress-bar').attr('style', 'width: ' + progressPercent + '%');
    this.$('#step-num').text('Step ' + stepInfo.number);
    this.$('#step-text').text(stepInfo.name);
  }

});

module.exports = DemoProgressComponent;
