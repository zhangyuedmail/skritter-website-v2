const GelatoDialog = require('gelato/dialog');
const Content = require('./content/view');
const Vocabs = require('collections/VocabCollection');
const Vocablist = require('models/VocablistModel');

/**
 * @class ExportVocablist
 * @extends {GelatoDialog}
 */
const ExportVocablist = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function (options) {
    options = options || {};
    this.content = new Content({dialog: this});
    this.vocablist = new Vocablist({id: options.id});
    this.vocablist.fetch();
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-cancel': 'handleClickButtonCancel',
    'click #button-export': 'handleClickButtonExport',
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
  render: function () {
    this.renderTemplate();

    this.content.setElement('#content-container').render();

    return this;
  },
  /**
   * @method downloadFile
   * @param {String} filename
   * @param {String} text
   */
  downloadFile: function (filename, text) {
    const element = document.createElement('a');

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
  handleClickButtonCancel: function (event) {
    event.preventDefault();
    this.close();
  },
  /**
   * @method handleClickButtonExport
   * @param {Event} event
   */
  handleClickButtonExport: function (event) {
    event.preventDefault();

    let vocabs = new Vocabs(null, {preloadAudio: false});
    let delimiter = '\t';
    let rows = this.vocablist.getRows();
    let groups = _.chunk(rows, 50);
    let groupsCompleted = 0;
    let languageCode = this.vocablist.get('lang');

    this.$('#button-export').hide();
    this.content.$('#download-progress').show();
    this.content.disableForm();

    async.eachLimit(
      groups,
      10,
      (group, callback) => {
        const mapProperty = languageCode === 'zh' ? 'tradVocabId' : 'vocabId';
        const vocabIds = _.map(group, mapProperty);

        vocabs.fetch({
          data: {
            ids: vocabIds.join('|'),
          },
          remove: false,
          error: (error) => callback(error),
          success: () => {
            groupsCompleted++;

            this.content.$('#download-progress .progress-bar')
              .css('width', (groupsCompleted / groups.length) * 100 + '%');

            callback();
          },
        });
      },
      (error) => {
        if (error) {
          // TODO: display some kind of error message
          this.$('#button-export').show();
          this.content.$('#download-progress').hide();
          this.content.enableForm();
        } else {
          const output = _.map(
            vocabs.models,
            function (vocab) {
              let line = '';

              if (vocab.isChinese()) {
                line += app.fn.mapper.toSimplified(vocab.get('writing')) + delimiter;
                line += app.fn.mapper.fromBase(vocab.id) + delimiter;
              } else {
                line += vocab.get('writing') + delimiter;
              }

              line += vocab.get('reading') + delimiter;
              line += vocab.getDefinition(true);

              return line;
            }
          );

          this.downloadFile('export-' + this.content.$('#export-name').val() + '.csv', output.join('\n'));

          this.close();
        }
      }
    );
  },
});

module.exports = ExportVocablist;
