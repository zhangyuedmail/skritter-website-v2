var GelatoDialog = require('gelato/dialog');
var Vocab = require('models/VocabModel');

/**
 * @class VocabCreatorDialog
 * @extends {GelatoDialog}
 */
var VocabCreatorDialog = GelatoDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    this.row = null;
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-add-word': 'handleClickButtonAddWord',
    'click #button-cancel': 'handleClickButtonCancel'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {VocabCreatorDialog}
   */
  render: function() {
    this.renderTemplate();
    return this;
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
   * @method handleClickButtonAddWord
   * @param {Event} event
   */
  handleClickButtonAddWord: function(event) {
    const self = this;
    const formData = this.getFormData();
    event.preventDefault();

    this.$('#error-message').empty();

    if (_.isEmpty(formData.reading)) {
      this.$('#error-message').text('A reading is required.');
      return;
    }

    if (_.isEmpty(formData.definition)) {
      this.$('#error-message').text('A definition is required.');
      return;
    }

    if (formData.lang === 'zh') {
      if (app.fn.pinyin.hasToneMarks(formData.reading)) {
        this.$('#error-message').text('Please convert all tone vowels to numbers. e.g. rén -> ren2');
      }
    }

    if (formData.lang === 'ja') {
      if (!wanakana.isKana(formData.reading)) {
        this.$('#error-message').text('Reading must be kana only.');
        return;
      }
    }

    $.ajax({
      type: 'POST',
      url: app.getApiUrl() + 'vocabs',
      headers: app.user.session.getHeaders(),
      data: JSON.stringify({
        definitions: {
          en: formData.definition
        },
        lang: formData.lang,
        reading: formData.reading,
        writing: formData.writing,
        writingTraditional: formData.writingTraditional
      }),
      error: function(error) {
        self.$('#error-message').text(JSON.stringify(error));
      },
      success: function(result) {
        self.trigger('vocab', new Vocab(result.Vocab));
        self.close();
      }
    });
  },
  /**
   * @method getFormData
   * @returns {Object}
   */
  getFormData: function() {
    var formData = {
      definition: this.$('#word-definition-input textarea').val(),
      lang: this.row.lang,
      reading: this.$('#word-reading-input input').val(),
      writing: this.row.writing
    };
    if (this.row.lang === 'zh') {
      if (this.row.writingTrads.length) {
        formData.writingTraditional = this.$('#word-writing-trad-input :selected').text();
      } else {
        formData.writingTraditional = this.row.writingTrads[0];
      }
    }
    return formData;
  },
  /**
   * @method open
   * @param {Object} options
   */
  open: function(options) {
    this.row = options.row;
    return GelatoDialog.prototype.open.call(this, options);
  }
});

module.exports = VocabCreatorDialog;
