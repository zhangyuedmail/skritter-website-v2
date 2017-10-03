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
    'click #skip-btn': 'handleSkipButtonClick',
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
  stepData: [
    {
      id: 'languageSelection',
      name: 'Language Selection',
    },
    {
      id: 'teachDemoChar1',
      name: 'First Characters',
    },
    {
      id: 'writeDemoChar1',
      name: 'Getting Hints',
    },
    {
      id: 'erasingCharacters',
      name: 'Erasing Characters',
    },
    {
      id: 'definitionPrompts',
      name: 'Definition Prompts',
    },
    {
      id: 'spacedRepetition',
      name: 'Spaced Repetition',
    },
    {
      id: 'readingPrompts',
      name: 'Reading Prompts',
    },
    {
      id: 'demoComplete',
      name: 'Demo Complete',
    },
  ],

  /**
   * Initializes a demo progress component
   * @param {Object} options data needed to initialize the view
   * @param {UserModel} options.user the app's usermodel. Must be passed in
   *                                 due to global app variable not available yet.
   */
  initialize: function (options) {
    this.demoPage = options.demoPage;
    this.firstStep = options.firstStep || this.stepData[0];

    if (this.demoPage.lang === 'zh') {
      this.stepData.splice(this.stepData.length - 2, 0, {
        id: 'tonePrompts',
        name: 'Tone Prompts',
      });
    }

    this.listenTo(this.demoPage, 'step:update', this.updateStep);
  },

  render: function () {
    this.renderTemplate();

    this.updateStep(this.firstStep);

    return this;
  },

  /**
   * Handles when the user clicks the settings button and navigates to
   * the settings page.
   * @param {jQuery.Event} e the click event
   */
  handleSkipButtonClick: function (e) {
    this.trigger('demo:skip');
  },

  /**
   * Updates the progress bar indicator to reflect which step of the demo
   * the user is currently on
   * @param {String} step the current step
   */
  updateStep: function (step) {
    let i = 0;
    let stepInfo;

    for (; i < this.stepData.length; i++) {
        if (this.stepData[i].id === step) {
          stepInfo = this.stepData[i];
          break;
        }
    }

    const progressPercent = ((i + 1) / this.stepData.length) * 100;

    this.$('.progress-bar').attr('style', 'width: ' + progressPercent + '%');
    this.$('#step-num').text('Step ' + (i + 1));
    this.$('#step-text').text(stepInfo.name);
  },

});

module.exports = DemoProgressComponent;
