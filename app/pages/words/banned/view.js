var GelatoPage = require('gelato/page');
var Vocabs = require('collections/vocabs');
var WordsSidebar = require('components/words/sidebar/view');
var ProgressDialog = require('dialogs/progress/view');
var VocabViewerDialog = require('dialogs1/vocab-viewer/view');
var VocabActionMixin = require('mixins/vocab-action');

/**
 * @class BannedWords
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.sidebar = new WordsSidebar();
    this.bannedVocabs = new Vocabs();
    this.limit = 20;
    this.listenTo(this.bannedVocabs, 'sync', this.renderTable);
    this.fetchBannedVocabs();
  },
  
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .writing-td': 'handleClickWritingTd',
    'change input[type="checkbox"]': 'handleChangeCheckbox',
    'click #load-more-btn': 'handleClickLoadMoreButton',
    'click #unban-vocabs-btn': 'handleClickUnbanVocabsButton'
  },
  
  /**
   * @method remove
   */
  remove: function() {
    this.sidebar.remove();
    
    return GelatoPage.prototype.remove.call(this);
  },
  
  /**
   * @method render
   * @returns {VocablistBrowse}
   */
  render: function() {
    this.renderTemplate();
    this.sidebar.setElement('#words-sidebar-container').render();
    
    return this;
  },
  
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  
  /**
   * @property title
   * @type {String}
   */
  title: 'Starred Words - Skritter',
  
  /**
   * @method fetchItems
   * @param {string} [cursor]
   */
  fetchBannedVocabs: function(cursor) {
    this.bannedVocabs.fetch({
      data: {
        sort: 'banned',
        limit: this.limit,
        cursor: cursor || ''
      },
      remove: false,
      sort: false
    });
  },
  
  /**
   * @method handleChangeCheckbox
   * @param {Event} event
   */
  handleChangeCheckbox: function(event) {
    var checkbox = $(event.target);
    if (checkbox.attr('id') === 'all-checkbox') {
      this.$('input[type="checkbox"]').prop('checked', checkbox.prop('checked'));
    }
    var anyChecked = this.$('input[type="checkbox"]:checked').length;
    this.$('#unban-vocabs-btn').prop('disabled', !anyChecked);
  },
  
  /**
   * @method handleClickLoadMoreButton
   */
  handleClickLoadMoreButton: function() {
    this.fetchBannedVocabs(this.bannedVocabs.cursor);
  },
  
  /**
   * @method handleClickUnbanVocabsButton
   */
  handleClickUnbanVocabsButton: function() {
    var self = this;
    var vocabs = new Vocabs();
    _.forEach(this.$('input:checked'), function(el) {
      var vocabID = $(el).closest('tr').data('vocab-id');
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
   * @method handleClickWritingTd
   * @param {Event} event
   */
  handleClickWritingTd: function(event) {
    event.preventDefault();
    var row = $(event.target).parent('tr');
    var vocabId = row.data('vocab-id');
    if (vocabId) {
      this.dialog = new VocabViewerDialog();
      this.dialog.load(vocabId);
      this.dialog.open();
    }
  },
  
  /**
   * @method renderTable
   */
  renderTable: function() {
    var context = require('globals');
    context.view = this;
    var rendering = $(this.template(context));
    this.$('.table-oversized-wrapper').replaceWith(rendering.find('.table-oversized-wrapper'));
  }
});

_.extend(module.exports.prototype, VocabActionMixin);
