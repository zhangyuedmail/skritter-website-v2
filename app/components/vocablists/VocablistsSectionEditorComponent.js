const GelatoComponent = require('gelato/component');

/**
 * @class VocablistsSectionEditorComponent
 * @extends {GelatoComponent}
 */
const VocablistsSectionEditorComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .section-link': 'handleClickSectionLink',
    'click #restore-section': 'handleClickRestoreSection',
    'click #remove-section': 'handleClickRemoveSection',
    'keyup .last-section': 'handleKeyupLastSection'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsSectionEditor'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.editing = false;
    this.vocablist = options.vocablist;
    this.listenTo(this.vocablist, 'change:sections', this.render);
    this.listenTo(this.vocablistSection, 'change:vocabs', this.render);
  },

  /**
   * @method render
   * @returns {VocablistsSectionEditorComponent}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },

  /**
   * @method addSection
   * @param {String} [name]
   */
  addSection: function(name) {
    this.updateVocablist();
    this.vocablist.get('sections').push({name: name, rows: []});
    this.render().$('.last-section').find('input').focus();
  },

  /**
   * @method handleClickRemoveSection
   * @param {Event} event
   */
  handleClickRemoveSection: function(event) {
    event.preventDefault();
    var $row = $(event.target).closest('.row');
    this.vocablist.get('sections')[$row.data('index')].deleted = true;
    this.render();
  },

  /**
   * @method handleClickRestoreSection
   * @param {Event} event
   */
  handleClickRestoreSection: function(event) {
    event.preventDefault();
    var $row = $(event.target).closest('.row');
    this.vocablist.get('sections')[$row.data('index')].deleted = false;
    this.render();
  },

  /**
   *
   * @param event
   */
  handleClickSectionLink: function(event) {
    event.preventDefault();
    event.stopPropagation();

    const url = $(event.currentTarget).attr('href').split('/');
    const listId = this.vocablist.id;
    const sectionId = url[url.length - 1];
    const section = (this.vocablist.get('sections').filter(s => s.id === sectionId) || [])[0];
    app.router.navigateVocablist(listId, sectionId, false, this.vocablist, section);
    app.router.navigate('vocablists/view/' + this.vocablist.id + '/' + sectionId, {trigger: false});
  },

  /**
   * @method handleKeyupLastSection
   * @param {Event} event
   */
  handleKeyupLastSection: function(event) {
    event.preventDefault();
    if (event.which === 13 || event.keyCode === 13) {
      if (!this.vocablist.get('singleSect')) {
        this.addSection();
      }
    }
  },

  /**
   * @method updateVocablist
   */
  updateVocablist: function() {
    this.$('#vocablist-sections')
      .children('.row')
      .each((function(index, element) {
        var name = $(element).find('#section-name').val();
        var section = this.vocablist.get('sections')[index];
        section.name = name;
      }).bind(this));
  }

});

module.exports = VocablistsSectionEditorComponent;
