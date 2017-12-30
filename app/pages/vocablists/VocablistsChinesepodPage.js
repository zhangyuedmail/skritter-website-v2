let GelatoPage = require('gelato/page');
const SignupNotification = require('components/account/SignupNotificationComponent');
let ChinesePodSession = require('models/ChinesepodSessionModel');
let ChinesePodLabels = require('collections/ChinesepodLabelCollection');
let ChinesePodLessons = require('collections/ChinesepodLessonCollection');
let VocablistSidebar = require('components/vocablists/VocablistsSidebarComponent');
/**
 * @class VocablistsChinesepodPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'submit #login-form': 'handleSubmitLoginForm',
    'click #logout-chinesepod-link': 'handleClickLogoutChineseLink',
    'keyup #search-input': 'handleChangeSearchInput',
    'change input[name="view-option"]': 'handleChangeViewOption',
    'click .lookup-link': 'handleClickLookupLink',
  },

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.vocabLists.titleCpod'),

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsChinesepod'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.sidebar = new VocablistSidebar();
    this.chinesepodSession = new ChinesePodSession();
    this.chinesepodLabels = new ChinesePodLabels();
    this.chinesepodLessons = new ChinesePodLessons();
    this._views['signup'] = new SignupNotification();

    this.viewOption = 'lessons';
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.searchString = '';
    this.chinesepodSession.fetch();

    this.listenToOnce(this.chinesepodSession, 'state', this.handleChinesepodSessionLoaded);
    this.listenTo(this.chinesepodLabels, 'state', this.render);
    this.listenTo(this.chinesepodLessons, 'state', this.render);
    this.listenTo(this.chinesepodLabels, 'error', this.handleChinesePodError);
    this.listenTo(this.chinesepodLessons, 'error', this.handleChinesePodError);
  },

  /**
   * @method render
   * @returns {VocablistsChinesepodPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsChinesepod.jade');
    }

    this.renderTemplate();
    this.sidebar.setElement('#vocablist-sidebar-container').render();
    this._views['signup'].setElement('#signup-container').render();
    return this;
  },

  /**
   * @method remove
   * @returns {VocablistBrowse}
   */
  remove: function () {
    this.sidebar.remove();
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * @method handleChinesepodSessionLoaded
   */
  handleChinesepodSessionLoaded: function () {
    this.render();
    if (!this.chinesepodSession.isNew()) {
      this.chinesepodLabels.fetch();
      this.chinesepodLessons.fetch();
    }
  },

  /**
   * @method handleSubmitLoginForm
   * @param {Event} event
   */
  handleSubmitLoginForm: function (event) {
    event.preventDefault();
    this.email = this.$('#email').val();
    this.password = this.$('#password').val();
    this.errorMessage = '';
    this.chinesepodSession.set({
      email: this.email,
      password: this.password,
    });
    this.chinesepodSession.save();
    this.listenToOnce(this.chinesepodSession, 'sync', function () {
      document.location.reload();
    });
    this.listenToOnce(this.chinesepodSession, 'error', function (model, jqxhr) {
      this.errorMessage = jqxhr.responseJSON.message;
      this.stopListening(this.chinesepodSession);
      this.render();
    });
    this.render();
  },

  /**
   * @method handleClickLogoutChineseLink
   */
  handleClickLogoutChineseLink: function () {
    this.chinesepodSession.destroy();
    this.listenToOnce(this.chinesepodSession, 'sync', function () {
      document.location.reload();
    });
  },
  /**
   * @method handleChangeSearchInput
   * @param {Event} e
   */
  handleChangeSearchInput: _.throttle(function (e) {
    this.searchString = $(e.target).val().toLowerCase();
    this.renderTable();
  }, 500),

  /**
   * @method handleChinesePodError
   * @param {Collection} collection
   * @param {jqXHR} jqxhr
   */
  handleChinesePodError: function (collection, jqxhr) {
    if (jqxhr.status === 504) {
      collection.fetch();
    }
  },

  /**
   * @method renderTable
   */
  renderTable: function () {
    let context = require('globals');
    context.view = this;
    let rendering = $(this.template(context));
    this.$('table').replaceWith(rendering.find('table'));
  },

  /**
   * @method handleChangeViewOption
   */
  handleChangeViewOption: function () {
    this.viewOption = $('input[name="view-option"]:checked').val();
    this.renderTable();
  },

  /**
   * @method handleClickLookupLink
   */
  handleClickLookupLink: function (e) {
    let lookupToken = $(e.target).data('lookup-token');
    let url = app.getApiUrl() + 'cpod/list/' + lookupToken;
    let headers = app.user.session.getHeaders();
    $(e.target).append($(' <i class=\'fa fa-1x fa-spinner fa-pulse\' />'));
    $.ajax({
      url: url,
      headers: headers,
      success: function (response) {
        document.location.href = '/vocablists/view/' + response.vocabListID;
      },
    });
  },
});
