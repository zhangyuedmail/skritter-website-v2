var GelatoDialog = require('gelato/dialog');
var Content = require('./content/view');
var Vocab = require('models/VocabModel');
var Vocablist = require('models/VocablistModel');

/**
 * @class ExportVocablist
 * @extends {GelatoDialog}
 */
var ExportVocablist = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    options = options || {};
    this.content = new Content({dialog: this});
    this.vocablist = new Vocablist({id: options.id});
    this.vocablist.fetch()
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-cancel': 'handleClickButtonCancel',
    'click #button-export': 'handleClickButtonExport'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {ExportVocablist}
   */
  render: function() {
    this.renderTemplate();
    this.content.setElement('#content-container').render();
    return this;
  },
  /**
   * @method downloadFile
   * @param {String} filename
   * @param {String} text
   */
  downloadFile: function(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
  /**
   * @method handleClickButtonCancel
   * @param {Event} event
   */
  handleClickButtonCancel: function(event) {
    event.preventDefault();
    this.close();
  },
  /**
   * @method handleClickButtonExport
   * @param {Event} event
   */
  handleClickButtonExport: function(event) {
    var self = this;
    var output = '';
    var delimiter = '\t';
    var rows = this.vocablist.getRows();
    var rowsCompleted = 0;
    event.preventDefault();
    this.$('#button-export').hide();
    this.content.$('#download-progress').show();
    this.content.disableForm();
    async.each(
      rows,
      function(row, callback) {
        var vocab = new Vocab({id: row.vocabId});
        vocab.fetch({
          error: function(error) {
            callback(error);
          },
          success: function() {
            rowsCompleted++;
            self.content.$('#download-progress .progress-bar').css('width', (rowsCompleted / rows.length) * 100 + '%');
            output += vocab.get('writing') + delimiter;
            if (vocab.isChinese()) {
              output += app.fn.mapper.fromBase(row.tradVocabId) + delimiter;
            }
            output += vocab.get('reading') + delimiter;
            output += vocab.getDefinition();
            output += '\n';
            callback();
          }
        })
      },
      function(error) {
        if (error) {
          //TODO: display some kind of error message
          self.$('#button-export').show();
          self.content.$('#download-progress').hide();
          self.content.enableForm();
        } else {
          self.downloadFile('export-' + self.content.$('#export-name').val() + '.csv', output);
          self.close();
        }
      }
    )
  }
});

module.exports = ExportVocablist;
