const GelatoDialog = require('gelato/dialog');
const vent = require('vent');

const N_DEFAULT_TRANSITION_TIME = 500;
const DEFAULT_TRANSITION_TIME = N_DEFAULT_TRANSITION_TIME + 'ms';

/**
 * @class VocabViewer
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  events: {
    'click #notification-button': 'handleNotificationButtonClicked',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./NotificationDialog.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    // options.ignoreBackdropClick = options.ignoreBackdropClick !== undefined ? options.ignoreBackgdropClick : true;
    this.set(options);
  },

  /**
   * @method render
   * @returns {VocabViewer}
   */
  render: function () {
    this.renderTemplate({
      dialogTitle: this.dialogTitle,
      showTitle: this.showTitle,
      body: this.body,
      buttonText: this.buttonText,
      showConfirmButton: this.showConfirmButton,
    });

    if (this.style) {
      _.defer(() => {
        this.setStyle(this.style);
        $('body').removeClass('modal-open');
      });
    }

    return this;
  },

  doExitAnimation: function () {
    return new Promise((resolve, reject) => {
      if (this.exitAnimation === 'fadeButton') {
        this.$('#notification-button').addClass('fade-out');
        // this.$('.modal-body').addClass('fade-out');
        setTimeout(function () {
          resolve();
        }, N_DEFAULT_TRANSITION_TIME / 2);
        // resolve();
      } else {
        resolve();
      }
    });
  },

  /**
   *
   * @param {jQuery.Event}event
   */
  handleNotificationButtonClicked: function (event) {
    if (this.next) {
      if (this.exitAnimation) {
        this.doExitAnimation().then(() => {
          this.set(this.next);
        });
      } else {
        this.set(this.next);
      }
    } else {
      vent.trigger('notification:close');
    }
  },

  /**
   * Sets the content of the dialog
   * @param {Object} options content and display options for the dialog
   * @param {String} [options.dialogTitle] the title for the dialog
   * @param {Boolean} [options.showTitle] whether to show a title on the dialog
   * @param {String} [options.body] the text to display
   * @param {String} [options.buttonText] the text for the confirm/close button
   * @param {Boolean} [options.showConfirmButton] whether to show a button to confirm/close the dialog
   */
  set: function (options) {
    options = options || {};

    this.dialogTitle = options.dialogTitle;
    this.showTitle = options.showTitle;
    this.body = options.body;
    this.buttonText = options.buttonText;
    this.showConfirmButton = options.showConfirmButton;
    this.next = options.next;
    this.style = options.style;
    this.enterAnimation = options.enterAnimation;
    this.exitAnimation = options.exitAnimation;

    if (this.style) {
      this.setStyle(this.style, this.enterAnimation);
    }

    this.updateValues();

    // if this is the first render and the dialog isn't already in the DOM,
    // this might not work right. Do it again just to make sure.
    _.defer(() => {
      this.updateValues();
    });

    return this;
  },

  /**
   *
   * @param {Object} style
   * @param {Object} [style.dialog] style options for the dialog
   * @param {Object} [style.backdrop] style options for the backdrop
   * @param {String} [animation] whether to animate the transition
   */
  setStyle: function (style, animation) {
    if (style.dialog) {
      if (animation) {
        this._addTransitionToElement(this.$('.modal'), animation);
        // this.$('.modal').css(this._generateAnimation(animation, true));
        // dialogStyle += this._generateAnimation(animate);
      }

      let dialogStyle = {'display': 'block'};
      for (let key in style.dialog) {
        if (style.dialog.hasOwnProperty(key)) {
          dialogStyle[key] = style.dialog[key];
        }
      }
      this.$('.modal').css(dialogStyle);
      // this.$('.modal').attr('style', dialogStyle);
    }

    if (style.backdrop) {
      let backdropStyle = '';
      for (let key in style.backdrop) {
        if (style.backdrop.hasOwnProperty(key)) {
          backdropStyle += key + ': ' + style.backdrop[key] + ';';
        }
      }
      $('.modal-backdrop').attr('style', backdropStyle);
    }
  },

  /**
   * Updates UI to refelect state values
   * @param {Boolean} [noAnimate] whether to ignore transitions and immediately show the state change
   */
  updateValues: function (noAnimate) {
    this.$('.dialog-title').toggleClass('hide-dialog-title', !this.dialogTitle || !this.showTitle).text(this.dialogTitle);
    this.$('.button-wrapper .btn').toggleClass('fade-out', !this.showConfirmButton);
    this.$('.modal-body').html(this.body);
    if (this.showConfirmButton) {
      this.$('#notification-button').text(this.buttonText || 'OK');
    }
  },

  /**
   * Adds transitions to an element
   */
  _addTransitionToElement: function (element, animation) {
    const transitions = this._generateAnimation(animation, true);

    element.css(transitions);
  },

  _generateAnimation: function (animName, asObj) {
    let animStr = '';

    if (animName === 'slide-up') {
      if (asObj) {
        return this._generateTransitionForProp('top', DEFAULT_TRANSITION_TIME, true);
      } else {
        animStr += this._generateTransitionForProp('top', DEFAULT_TRANSITION_TIME);
      }
    }

    return animStr;
  },

  /**
   * Generates cross-browser-compatible transitions for a set of CSS properties
   * @param {String} props a string that lists the properties to animate
   * @param {String} time the amount of time to animate the property
   * @param {Boolean} [asObj] whether to return the result as an object. Defaults to a string
   * @returns {Object|String}
   */
  _generateTransitionForProp: function (props, time, asObj) {
    if (asObj) {
      return {
        '-webkit-transition': `${props} ${time}`,
        '-moz-transition': `${props} ${time}`,
        '-ms-transition': `${props} ${time}`,
        'transition': `${props} ${time}`,
      };
    }
    return `-webkit-transition: ${props} ${time}; -moz-transition: ${props} ${time}; -ms-transition: ${props} ${time}; transition: ${props} ${time};`;
  },
});
