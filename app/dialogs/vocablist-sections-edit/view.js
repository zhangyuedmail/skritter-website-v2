let BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class VocablistSectionsEdit
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @method initialize
   * @param {Object} options
   */
  initialize: function(options) {
    this.vocablist = options.vocablist;
    if (!this.vocablist) {
      throw new Error('VocablistSectionsEdit requires a vocablist passed in!');
    }
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {VocablistSectionsEdit}
   */
  render: function() {
    this.renderTemplate();

    // jquery-ui doesn't hook into this.$, so use global $ instead
    $(this.el).find('.list-group').sortable({
      handle: '.glyphicon-option-vertical',
    });
    return this;
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #confirm-btn': 'handleClickConfirmButton',
    'click #cancel-btn': 'handleClickCancelButton',
    'click .glyphicon-remove': 'handleClickRemoveLink',
    'click #add-section-btn': 'handleClickAddSectionButton',
  },
  /**
   * @method handleClickCloseButton
   * @param {Event} e
   */
  handleClickCancelButton: function(e) {
    this.close();
  },
  /**
   * @method handleClickSaveButton
   * @param {Event} e
   */
  handleClickConfirmButton: function() {
    let sections = [];
    $.each(this.$('.list-group-item'), function(i, el) {
      let id = ($(el).data('section-id') || '').toString();

      let section = {
        name: $(el).find('input').val(),
        deleted: $(el).hasClass('hide'),
      };

      if (id) {
        section.id = id;
      }

      sections.push(section);
    });
    this.vocablist.save({sections: sections}, {patch: true, method: 'PUT'});
    this.close();
  },
  /**
   * @method handleClickRemoveLink
   * @param {Event} e
   */
  handleClickRemoveLink: function(e) {
    $(e.target).closest('.list-group-item').addClass('hide');
  },
  /**
   * @method handleClickAddSectionButton
   */
  handleClickAddSectionButton: function() {
    let newRow = this.$('#new-section-template').clone().removeClass('hide');
    this.$('.list-group').append(newRow);
  },
});
