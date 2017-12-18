/**
 * @class GelatoView
 * @extends {Backbone.View}
 */
let GelatoView = Backbone.View.extend({

  /**
   * Instantiates certain instance variables so they are setup correctly for inheritance
   * @param {Object} [options]
   */
  constructor: function (options) {
    /**
     * Dictionary that contains subviews this view manages
     * @property _views
     * @type {Object<String, Backbone.View>}
     */
    this._views = {};

    Backbone.View.prototype.constructor.apply(this, arguments);
  },

  /**
   * @property $view
   * @type {jQuery}
   */
  $view: null,

  /**
   * @property template
   * @type {Function}
   */
  template: null,

  /**
   * @param {String} [selector]
   * @returns {GelatoView}
   */
  disableForm: function (selector) {
    this.$((selector ? selector + ' ' : '') + ':input').prop('disabled', true);
    return this;
  },

  /**
   * @param {String} [selector]
   * @returns {GelatoView}
   */
  enableForm: function (selector) {
    this.$((selector ? selector + ' ' : '') + ':input').prop('disabled', false);
    return this;
  },

  /**
   * @method getHeight
   * @returns {Number}
   */
  getHeight: function () {
    return this.$view.height();
  },

  /**
   * @method getWidth
   * @returns {Number}
   */
  getWidth: function () {
    return this.$view.width();
  },

  /**
   * @method handleClickHref
   * @param {Event} event
   */
  handleClickHref: function (event) {
    let target = Backbone.$(event.currentTarget);
    let href = target.attr('href');
    let ignore = target.data('ignore');
    if (window.app !== undefined &&
      window.app.router !== undefined &&
      !ignore &&
      href !== undefined &&
      href.indexOf('#') !== 0 &&
      href.indexOf('http://') !== 0 &&
      href.indexOf('https://') !== 0) {
      event.preventDefault();
      let dataReplace = target.data('replace');
      let dataTrigger = target.data('trigger');
      window.app.router.navigate(
        href,
        {
          replace: dataReplace !== undefined ? dataReplace : false,
          trigger: dataTrigger !== undefined ? dataTrigger : true,
        }
      );
    }
  },

  /**
   * Creates an object of variables accessible to the template when it renders
   * @method getContext
   * @param {Object} [context] additional variables to supply along
   *                            with the default globals
   * @returns {Object} a merged, unique object that holds all variables
   *                    available to a template at render time.
   */
  getContext: function (context) {
    const globals = require('globals') || {};
    const appState = {
      app: window.app,
      locale: window.app.locale,
      view: this,
    };

    const renderContext = Backbone.$.extend(true, {}, globals, appState, context || {});

    return renderContext;
  },

  /**
   * @method hide
   * @returns {GelatoView}
   */
  hide: function () {
    this.$view.hide(arguments.length ? arguments : 0);
    return this;
  },

  /**
   * @method parseTemplate
   * @param {Function} template
   * @param {Object} [context]
   * @returns {Object}
   */
  parseTemplate: function (template, context) {
    if (typeof template === 'function') {
      return template(this.getContext(context));
    }
    return template;
  },

  /**
   * Unsubscribes from events, calls remove on subviews, and removes DOM elements
   * @method remove
   * @returns {GelatoView}
   */
  remove: function () {
    this.stopListening();
    this.undelegateEvents();

    for (let view in this._views) {
      if (this._views.hasOwnProperty(view)) {
        this._views[view].remove();
      }
    }

    if (_.isFunction(this.onRemove)) {
      this.onRemove();
    }

    this.$el.find('*').off();
    this.$el.empty();
    this._removeElement();
    Backbone.$(window).off('resize.View');

    return this;
  },

  /**
   * @method render
   * @returns {GelatoView}
   */
  render: function () {
    this.renderTemplate();
    return this;
  },

  /**
   * Renders a view's template with the provided context and optionally adds
   * a header and a footer.
   * @method renderTemplate
   * @param {Object} [context]
   * @returns {GelatoView}
   */
  renderTemplate: function (context) {
    this.$view = Backbone.$(this.parseTemplate(this.template, context));
    this.$el.html(this.$view);
    this.$('a[href]').on('click', this.handleClickHref);
    Backbone.$(window).on('resize.View', (function (event) {
      clearTimeout(this._resize);
      this._resize = setTimeout((function () {
        this._resize = null;
        this.trigger('resize', event);
      }).bind(this), 200);
    }).bind(this));
    this.delegateEvents();
    return this;
  },

  /**
   * Gets an element on the page's y-position and scrolls to that element
   * @param {String} selector the jQuery selector for the element
   */
  scrollTo (selector) {
    const el = this.$(selector);
    const yPos = el.position().top;
    if (app.isMobile()) {
      try {
        el[0].scrollIntoView({block: 'end'});
      } catch (e) {
        el[0].scrollIntoView();
      }
    } else {
      window.scrollTo(0, yPos);
    }
  },

  /**
   * @method show
   * @returns {GelatoView}
   */
  show: function () {
    this.$view.show(arguments.length ? arguments : 0);
    return this;
  },
});

module.exports = GelatoView;
