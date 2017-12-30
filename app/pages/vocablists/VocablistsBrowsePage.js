const GelatoPage = require('gelato/page');
const SignupNotification = require('components/account/SignupNotificationComponent');
const Table = require('components/vocablists/VocablistsBrowseTableComponent');
const Sidebar = require('components/vocablists/VocablistsSidebarComponent');
const ExpiredNotification = require('components/account/AccountExpiredNotificationComponent');
const vent = require('vent');

/**
 * A page that allows a user to browse different categories of vocablists they can study.
 * @class VocablistBrowse
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'change input[type="checkbox"]': 'handleChangeCheckbox',
    'click .filter-label': 'handleClickFilterLabel',
    'keyup #list-search-input': 'handleKeypressListSearchInput',
    'click #list-option': 'handleClickListOption',
    'click #grid-option': 'handleClickGridOption',
  },

  navbarOptions: {
    showCreateListBtn: true,
  },

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.vocabLists.titleBrowse'),

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsBrowse'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
      this.loadAlreadyTimed = false;
    }

    this.filterType = 'textbook';

    this._views['sidebar'] = new Sidebar();
    this._views['table'] = new Table();
    this._views['expiration'] = new ExpiredNotification();
    this._views['signup'] = new SignupNotification();

    if (app.config.recordLoadTimes) {
      this.componentsLoaded = {
        table: false,
      };
      this.listenTo(this._views['table'], 'component:loaded', this._onComponentLoaded);
    }
  },

  /**
   * @method render
   * @returns {VocablistBrowse}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsBrowse.jade');
    }

    this.renderTemplate();
    this._views['sidebar'].setElement('#vocablist-sidebar-container').render();
    this._views['table'].setElement('#vocablist-container').render();
    this._views['expiration'].setElement('#expiration-container').render();
    this._views['signup'].setElement('#signup-container').render();

    if (app.getSetting('newuser-' + app.user.id) && !app.getSetting('newuser-' + app.user.id + '-seen-browsevocablist')) {
      this.showAddListsTooltip();
    }

    return this;
  },

  /**
   * @method handleChangeCheckbox
   */
  handleChangeCheckbox: function (event) {
    const searchValue = this.$('#list-search-input').val();

    this.filterType = this.$('#textbook-filter-toggle-input').is(':checked') ? 'published' : 'textbook';

    this._views['table'].vocablists.reset();

    if (this.filterType === 'textbook') {
      this._views['table'].setFilterType('textbook');
      this._views['table'].fetchOfficialLists();
    } else {
      this._views['table'].setFilterType('published');

      if (searchValue === '') {
        this._views['table'].fetchLists({sort: 'published'});
      } else {
        this._views['table'].fetchLists({q: searchValue, sort: 'search'});
      }
    }

    this.$('.textbook-label').toggleClass('selected', this.filterType === 'textbook');
    this.$('.published-label').toggleClass('selected', this.filterType === 'published');
  },

  /**
   * Handles when the
   * @param {jQuery.Event} event
   */
  handleClickFilterLabel (event) {
    const el = $(event.target);

    if (el.hasClass('selected')) {
      return;
    }

    this.$('#textbook-filter-toggle-input').trigger('click');
  },
  /**
   * @method onClickListOption
   * @param {Event} event
   */
  handleClickListOption: function (event) {
    event.preventDefault();

    this._views['table'].setLayout('list');
    this.$('#list-option').addClass('chosen');
    this.$('#grid-option').removeClass('chosen');
  },

  /**
   * @method onClickGridOption
   * @param {Event} event
   */
  handleClickGridOption: function (event) {
    event.preventDefault();

    this._views['table'].setLayout('grid');
    this.$('#list-option').removeClass('chosen');
    this.$('#grid-option').addClass('chosen');
  },

  /**
   * @method handleKeypressListSearchInput
   * @param {Event} event
   */
  handleKeypressListSearchInput: function (event) {
    if (event.which === 13 || event.keyCode === 13) {
      const searchValue = event.target.value;

      if (this.filterType === 'published') {
        this._views['table'].vocablists.reset();

        if (searchValue === '') {
          this._views['table'].fetchLists({sort: 'published'});
        } else {
          this._views['table'].fetchLists({q: _.toLower(searchValue), sort: 'search'});
        }
      } else {
        this._views['table'].setFilterString(searchValue);
      }

      return true;
    }

    return false;
  },

  /**
   * Shows a popup to new users who just created an account
   * that informs them what the lists are and how to add one.
   */
  showAddListsTooltip: function () {
    let welcome = app.locale('pages.vocabLists.newUserBrowseDialogWelcome' + app.getLanguage());
    if (app.isChinese() && app.user.get('reviewTraditional') && !app.user.get('reviewSimplified')) {
      welcome = app.locale('pages.vocabLists.newUserBrowseDialogWelcomezhTrad');
    }

    let dialogBody = welcome + app.locale('pages.vocabLists.newUserBrowseDialogDescription');
    dialogBody += app.locale('pages.vocabLists.newUserBrowseDialogDescriptionTextbooks' + app.getLanguage());
    dialogBody += app.locale('pages.vocabLists.newUserBrowseDialogDescription2');

    vent.trigger('notification:show', {
      body: dialogBody,
      buttonText: app.locale('pages.vocabLists.newUserBrowseDialogConfirm'),
      dialogTitle: app.locale('pages.vocabLists.newUserBrowseDialogTitle'),
      exitAnimation: 'fadeButton',
      showConfirmButton: true,
      showTitle: true,
      style: {
        dialog: {
          top: '20%',
          width: app.isMobile() ? '100%' : '50%',
          left: app.isMobile() ? '0%' : '25%',
        },
      },
    });

    app.setSetting('newuser-' + app.user.id + '-seen-browsevocablist', true);
  },

  /**
   * Keeps track of which components have loaded. When everything is loaded,
   * if timing is being recorded, this calls a function to record
   * the load time.
   * @param {String} component the name of the component that was loaded
   * @private
   */
  _onComponentLoaded: function (component) {
    this.componentsLoaded[component] = true;

    // return if any component is still not loaded
    for (let component in this.componentsLoaded) {
      if (this.componentsLoaded[component] !== true) {
        return;
      }
    }

    // but if everything's loaded, since this is a page, log the time
    this._recordLoadTime();
  },

  /**
   * Records the load time for this page once.
   * @private
   */
  _recordLoadTime: function () {
    if (this.loadAlreadyTimed || !app.config.recordLoadTimes) {
      return;
    }

    this.loadAlreadyTimed = true;
    const loadTime = window.performance.now() - this.loadStart;
    app.loadTimes.pages.vocablistsBrowse.push(loadTime);
  },
});
