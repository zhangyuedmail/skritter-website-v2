var GelatoPage = require('gelato/page');
var EditorSections = require('components/vocablists/VocablistsSectionEditorComponent');
var Sidebar = require('components/vocablists/VocablistsListSidebarComponent');
var Vocablist = require('models/VocablistModel');
var VocablistSection = require('models/VocablistSectionModel');

/**
 * @class VocablistsListPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #add-section': 'handleClickAddSection',
    'click #discard-changes': 'handleClickDiscardChanges',
    'click #edit-list': 'handleClickEditList',
    'click #save-changes': 'handleClickSaveChanges'
  },

  /**
   * @property title
   * @type {String}
   */
  title: 'Vocablist - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsList'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.editing = false;
    this.vocablist = new Vocablist({id: options.vocablistId});
    this.vocablistSection = new VocablistSection({vocablistId: options.vocablistId});
    this.editor = new EditorSections({vocablist: this.vocablist, vocablistSection: this.vocablistSection});
    this.sidebar = new Sidebar({vocablist: this.vocablist});

    this.fetchList();
  },

  /**
   * @method render
   * @returns {VocablistsListPage}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsList.jade');
    }

    this.renderTemplate();
    this.editor.setElement('#editor-container').render();
    this.sidebar.setElement('#sidebar-container').render();

    if (this.vocablist.has('name')) {
      document.title = this.vocablist.get('name') + ' - Vocablist - Skritter';
    }

    return this;
  },

  /**
   * @method remove
   * @returns {VocablistsListPage}
   */
  remove: function() {
    this.editor.remove();
    this.sidebar.remove();

    return GelatoPage.prototype.remove.call(this);
  },


  /**
   * Fetches the vocablist and associated data
   * @method fetchList
   */
  fetchList: function() {
    var self = this;

    async.series([
      function(callback) {
        self.vocablist.fetch({
          error: function() {
            callback();
          },
          success: function() {
            callback();
          }
        });
      },
      _.bind(self.fetchVocablistSections, this)
    ], function(error) {
      self.listenTo(self.vocablist, 'state:standby', self.handleVocablistState);
      self.render();
    });
  },

  /**
   * Fetches the sections for a vocablist
   * @param {Function} callback called when the sections are fetched
   */
  fetchVocablistSections: function(callback) {
    if (this.vocablist.get('sections').length === 1) {
      this.vocablistSection.set('id', this.vocablist.get('sections')[0].id);
      this.vocablistSection.fetch({
        error: function(error) {
          callback(error);
        },
        success: function() {
          callback();
        }
      });
    } else {
      callback();
    }
  },

  /**
   * @method handleClickAddSection
   * @param {Event} event
   */
  handleClickAddSection: function(event) {
    event.preventDefault();
    this.editor.addSection();
  },

  /**
   * @method handleClickDiscardChanges
   * @param {Event} event
   */
  handleClickDiscardChanges: function(event) {
    event.preventDefault();
    this.editing = false;
    this.editor.editing = false;
    this.render();
  },

  /**
   * @method handleClickEditList
   * @param {Event} event
   */
  handleClickEditList: function(event) {
    event.preventDefault();
    this.editing = true;
    this.editor.editing = true;
    this.render();
  },

  /**
   * @method handleClickSaveChanges
   * @param {Event} event
   */
  handleClickSaveChanges: function(event) {
    event.preventDefault();
    this.editing = false;
    this.editor.editing = false;
    this.updateVocablist();
    this.editor.updateVocablist();
    if (this.vocablist.isFinished()) {
      this.vocablist.set('studyingMode', 'adding');
    }
    this.vocablist.save(null, {patch: true});
    this.render();
  },

  /**
   * @method handleVocablistState
   */
  handleVocablistState: function() {
    this.sidebar.render();
    this.render();
  },

  /**
   * @method updateVocablist
   */
  updateVocablist: function() {
    this.vocablist.set({
      description: this.$('.list-description').val(),
      name: this.$('.list-name').val()
    });
  }
});
