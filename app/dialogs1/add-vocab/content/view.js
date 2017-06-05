var GelatoComponent = require('gelato/component');
var Vocabs = require('collections/VocabCollection');

/**
 * @class AddVocabContent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(options) {
    this.dialog = options.dialog;
    this.groups = [];
    this.vocablist = null;
    this.vocabs = new Vocabs();
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-add': 'handleClickButtonAdd',
    'click #button-clear': 'handleClickButtonClear',
    'click #button-search': 'handleClickButtonSearch',
    'keyup #vocab-input': 'handleKeyupVocabInput'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {AddVocabContent}
   */
  render: function() {
    this.renderTemplate();
    this.listenToOnce(this.dialog.vocablists, 'state', this.render);
    return this;
  },
  /**
   * Returns a vocablist if a page has one declared.
   * @returns {null}
   */
  getCurrentList: function() {
    if (!app.router.page.vocablist) {
      return null;
    }

    return app.router.page.vocablist;
  },
  /**
   * @method getFormData
   * @returns {Object}
   */
  getFormData: function() {
    return {
      listId: this.$('#vocab-list').val(),
      sectionId: this.$('#vocab-list-section').val(),
      vocabId: this.$('#vocab-result').val()
    };
  },
  /**
   * @method handleClickButtonAdd
   * @param {Event} event
   */
  handleClickButtonAdd: function(event) {
    event.preventDefault();
    var self = this;
    var formData = this.getFormData();
    var section = this.vocablist.getSectionById(formData.sectionId);
    var group = this.groups[formData.vocabId];
    var row = {};
    if (group[0].isChinese()) {
      row.vocabId = group[0].id;
      if (group.length > 1) {
        row.tradVocabId = group[1].id;
      } else {
        row.tradVocabId = group[0].id;
      }
    } else {
      row.vocabId = group[0].id;
      row.tradVocabId = group[0].id;
      row.studyWriting = true;
    }
    section.rows.push(row);
    $.ajax({
      context: this,
      url: app.getApiUrl() + 'vocablists/' + this.vocablist.id + '/sections/' + section.id,
      type: 'PUT',
      headers: app.user.session.getHeaders(),
      data: JSON.stringify(section),
      error: function(error) {
        console.log(error);
      },
      success: function() {
        self.dialog.close();
      }
    });
  },
  /**
   * @method handleClickButtonClear
   * @param {Event} event
   */
  handleClickButtonClear: function(event) {
    event.preventDefault();
    this.vocablist = null;
    this.vocabs.reset();
    this.render();
  },
  /**
   * @method handleClickButtonSearch
   * @param {Event} event
   */
  handleClickButtonSearch: function(event) {
    event.preventDefault();
    this.search(this.$('#vocab-input').val());
  },
  /**
   * @method handleKeyupVocabInput
   * @param {Event} event
   */
  handleKeyupVocabInput: function(event) {
    event.preventDefault();
    if (event.which == 13 || event.keyCode == 13) {
      this.search(this.$('#vocab-input').val());
    }
  },
  /**
   * @method search
   * @param {String} value
   */
  search: function(value) {
    var self = this;
    var formData = this.getFormData();
    var vocablist = this.dialog.vocablists.get(formData.listId);
    async.series(
      [
        function(callback) {
          vocablist.fetch({
            error: function(error) {
              callback(error);
            },
            success: function() {
              self.vocablist = vocablist;
              callback();
            }
          });
        },
        function(callback) {
          self.vocabs.fetch({
            data: {
              lang: app.getLanguage(),
              q: value
            },
            error: function(error) {
              console.error(error);
              self.vocabs.reset();
              callback(error);
            },
            success: function() {
              callback();
            }
          });
        }
      ],
      function() {
        self.groups = self.vocabs.groupBy(function(vocab) {
          return vocab.getBase();
        });
        self.render();
      }
    );
  }
});
