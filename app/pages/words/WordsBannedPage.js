const GelatoPage = require('gelato/page');
const Vocabs = require('collections/VocabCollection');
const WordsSidebar = require('components/words/WordsSidebarComponent');
const VocabActionMixin = require('mixins/vocab-action');
const vent = require('vent');

/**
 * @class BannedWords
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .vocab-row': 'handleClickVocabRow',
    'change input[type="checkbox"]': 'handleChangeCheckbox',
    'click #load-more-btn': 'handleClickLoadMoreButton',
    'click #unban-vocabs-btn': 'handleClickUnbanVocabsButton',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./WordsBanned'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Banned Words - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.sidebar = new WordsSidebar();
    this.bannedVocabs = new Vocabs();
    this.limit = 20;
    this.listenTo(this.bannedVocabs, 'sync', this.renderTable);
    this.fetchBannedVocabs();
  },

  /**
   * @method remove
   */
  remove: function () {
    this.sidebar.remove();

    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * @method render
   * @returns {VocablistBrowse}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileWordsBanned.jade');
    }

    this.renderTemplate();
    this.sidebar.setElement('#words-sidebar-container').render();

    return this;
  },

  /**
   * @method fetchItems
   * @param {string} [cursor]
   */
  fetchBannedVocabs: async function (cursor) {
    if (app.user.offline.isReady()) {
      const vocabs = _.filter(await app.user.offline.loadAllVocabs(), (vocab) => !!vocab.bannedParts.length);

      this.bannedVocabs.add(vocabs);

      this.renderTable();
    } else {
      this.bannedVocabs.fetch({
        data: {
          sort: 'banned',
          lang: app.getLanguage(),
          limit: this.limit,
          cursor: cursor || '',
        },
        remove: false,
        sort: false,
      });
    }
  },

  /**
   * @method handleChangeCheckbox
   * @param {Event} event
   */
  handleChangeCheckbox: function (event) {
    let checkbox = $(event.target);
    if (checkbox.attr('id') === 'all-checkbox') {
      this.$('input[type="checkbox"]').prop('checked', checkbox.prop('checked'));
    }
    let anyChecked = this.$('input[type="checkbox"]:checked').length;
    this.$('#unban-vocabs-btn').prop('disabled', !anyChecked);
  },

  /**
   * @method handleClickLoadMoreButton
   */
  handleClickLoadMoreButton: function () {
    this.fetchBannedVocabs(this.bannedVocabs.cursor);
  },

  /**
   * @method handleClickUnbanVocabsButton
   */
  handleClickUnbanVocabsButton: function () {
    let self = this;
    let vocabs = new Vocabs();
    _.forEach(this.$('input:checked'), function (el) {
      let vocabID = $(el).closest('tr').data('vocab-id');
      if (!vocabID) {
        return;
      }
      vocabs.add(self.bannedVocabs.get(vocabID));
      self.bannedVocabs.remove(vocabID);
    });
    this.beginVocabAction('unban', vocabs);
    this.renderTable();
    this.$('#unban-vocabs-btn').prop('disabled', true);
  },

  /**
   * @method handleClickVocabRow
   * @param {Event} event
   */
  handleClickVocabRow: function (event) {
    event.preventDefault();
    const row = $(event.target).parent('tr');
    const vocabId = row.data('vocab-id');

    if (vocabId) {
      vent.trigger('vocabInfo:toggle', vocabId);
    }
  },

  /**
   * @method renderTable
   */
  renderTable: function () {
    let context = require('globals');
    context.view = this;
    let rendering = $(this.template(context));
    this.$('.table-oversized-wrapper').replaceWith(rendering.find('.table-oversized-wrapper'));
  },
});

_.extend(module.exports.prototype, VocabActionMixin);
